import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import * as Progress from "react-native-progress";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import FloatingMenu from "../components/FloatingMenu";
import { getRewardByDisabledStatus } from "../redux/rewardSlice";
import { createOrUpdate, getByPupilId } from "../redux/owned_rewardSlice";
import { pupilById, updatePupilProfile } from "../redux/pupilSlice";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";

export default function RewardScreen({ navigation }) {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("Exchange points");
  const [selectedReward, setSelectedReward] = useState(null);
  const [selectedRewardOwn, setSelectedRewardOwn] = useState(null);
  const [filteredRewardList, setFilteredRewardList] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isExchanging, setIsExchanging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const lastFetchRef = useRef(null);
  const retryCountRef = useRef(0);
  const lastSyncRef = useRef(null);

  // Lấy dữ liệu từ Redux
  const user = useSelector((state) => state.auth);
  const userId = user?.user?.id;
  const pupil = useSelector((state) => state.pupil.pupil, isEqual);
  const pupilId = pupil?.id;
  const pupilLoading = useSelector((state) => state.pupil.loading);
  const pupilError = useSelector((state) => state.pupil.error);
  const rawRewardList = useSelector(
    (state) => state.reward?.list || [],
    isEqual
  );
  const rewardLoading = useSelector((state) => state.reward.loading);
  const rewardError = useSelector((state) => state.reward.error);
  const owned_rewards = useSelector(
    (state) => state.owned_reward?.list || [],
    isEqual
  );
  const owned_reward_error = useSelector(
    (state) => state.owned_reward?.error || null
  );

  // Debug dữ liệu
  console.log("Debug data:", { userId, pupilId, pupil, owned_rewards });

  // Monitor owned_rewards changes for debugging
  useEffect(() => {
    console.log("owned_rewards updated:", owned_rewards);
    const invalidEntries = owned_rewards.filter(
      (o) => !o || typeof o !== "object" || !o.rewardId || o.quantity == null
    );
    if (invalidEntries.length > 0) {
      console.warn("Invalid owned_rewards entries detected:", invalidEntries);
    }
  }, [owned_rewards]);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!user || !user.user || !userId) {
      Alert.alert("Error", "Please log in to access this screen.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    }
  }, [user, userId, navigation]);

  // Lấy dữ liệu khi màn hình focus
  useEffect(() => {
    if (!isFocused || !userId || !pupilId) return;

    const fetchData = async () => {
      const now = Date.now();
      if (!lastFetchRef.current || now - lastFetchRef.current > 60000) {
        lastFetchRef.current = now;
        retryCountRef.current = 0;

        try {
          await dispatch(getRewardByDisabledStatus()).unwrap();

          let targetPupilId = pupilId;
          if (!pupil || pupil.userId !== userId) {
            let pupilAction;
            while (retryCountRef.current < 3) {
              try {
                pupilAction = await dispatch(pupilById(userId)).unwrap();
                targetPupilId = pupilAction?.id || pupilId;
                break;
              } catch (error) {
                retryCountRef.current += 1;
                console.warn(
                  `pupilById retry ${retryCountRef.current}/3 failed:`,
                  error
                );
                if (retryCountRef.current >= 3) {
                  console.error("Final pupilById:", pupilId);
                  if (!pupil || !pupilId) {
                    Alert.alert(
                      "Error",
                      "Failed to load pupil data. Please log in again or contact support.",
                      [
                        {
                          text: "OK",
                          onPress: () => navigation.navigate("Login"),
                        },
                      ]
                    );
                    return;
                  }
                  break;
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            }
          }

          if (targetPupilId) {
            await dispatch(getByPupilId(targetPupilId)).unwrap();
          } else {
            console.warn("No pupilId available for getByPupilId");
            Alert.alert(
              "Error",
              "No pupil ID found. Please log in again or contact support.",
              [{ text: "OK", onPress: () => navigation.navigate("Login") }]
            );
          }
        } catch (error) {
          console.error("API error:", error);
          Alert.alert(
            "Error",
            `Failed to load data: ${error?.en || error?.vi || "Unknown error"}`
          );
        }
      }
    };

    fetchData();
  }, [isFocused, userId, pupilId, pupil, dispatch, navigation]);

  // Cập nhật filteredRewardList
  useEffect(() => {
    if (!rawRewardList) return;
    setFilteredRewardList((prev) =>
      isEqual(prev, rawRewardList) ? prev : rawRewardList
    );
  }, [rawRewardList]);

  // Đặt số lượng mặc định dựa trên tab
  useEffect(() => {
    if (selectedTab === "Exchange points") {
      setQuantity("10");
      setIsValid(true);
    } else if (selectedTab === "Exchange item") {
      setQuantity("1");
      setIsValid(true);
    }
  }, [selectedTab]);

  // Xử lý khi click vào ảnh phần thưởng
  const handleRewardPress = (item) => {
    console.log("handleRewardPress called with rewardId:", item.id);
    setSelectedReward(item);
  };

  const handleOwnRewardPress = (item) => {
    setSelectedRewardOwn(item);
  };

  const cardNumber = (value) => {
    setQuantity(value);
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 10 && numericValue <= 200) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const rewardNumber = (value) => {
    setQuantity(value);
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 1) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  // Hàm retry cho getByPupilId
  const fetchOwnedRewardsWithRetry = async (pupilId, maxRetries = 3) => {
    let retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        const now = Date.now();
        const action = await dispatch(getByPupilId(pupilId)).unwrap();
        console.log("fetchOwnedRewardsWithRetry response:", action);
        lastSyncRef.current = now;
        return action;
      } catch (error) {
        retryCount += 1;
        console.warn(
          `getByPupilId retry ${retryCount}/${maxRetries} failed:`,
          error
        );
        if (retryCount >= maxRetries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  // Xử lý nút đổi phần thưởng
  const handleExchange = async () => {
    if (
      isExchanging ||
      !isValid ||
      !selectedReward ||
      !pupilId ||
      !pupil ||
      !userId
    ) {
      console.warn("handleExchange blocked:", {
        isExchanging,
        isValid,
        selectedReward,
        pupilId,
        pupil,
        userId,
      });
      Alert.alert(
        "Error",
        "Invalid input, missing user data, or pupil not found!"
      );
      return;
    }

    const rewardId = selectedReward.id;
    const exchangeQuantity = parseInt(quantity, 10);
    const exchangePoint = parseInt(selectedReward.exchangePoint, 10);
    const exchangeReward = parseInt(selectedReward.exchangeReward, 10);

    console.log("handleExchange called:", {
      rewardId,
      exchangeQuantity,
      exchangePoint,
      exchangeReward,
    });

    if (!rewardId) {
      Alert.alert("Error", "Reward ID is missing!");
      return;
    }

    setIsExchanging(true);
    setIsRefreshing(true);

    try {
      if (selectedTab === "Exchange points") {
        if (isNaN(exchangePoint) || exchangePoint <= 0) {
          Alert.alert("Error", "Invalid reward exchange point.");
          return;
        }

        const totalPointsRequired = exchangePoint * exchangeQuantity;

        if (totalPointsRequired > pupil.point) {
          Alert.alert(
            "Error",
            `You need ${totalPointsRequired} points but only have ${pupil.point}.`
          );
          return;
        }

        await dispatch(
          createOrUpdate({
            pupilId,
            rewardId,
            quantity: exchangeQuantity,
          })
        ).unwrap();

        console.log("createOrUpdate called, fetching owned rewards...");
        await fetchOwnedRewardsWithRetry(pupilId);

        const updatePupilAction = await dispatch(
          updatePupilProfile({
            id: pupilId,
            data: {
              point: pupil.point - totalPointsRequired,
            },
          })
        ).unwrap();

        if (!updatePupilAction) {
          throw new Error("Failed to update pupil points.");
        }

        Alert.alert("Success", "Reward exchanged successfully!");
        setSelectedReward(null);
        setQuantity("10");
      } else if (selectedTab === "Exchange item") {
        if (isNaN(exchangeReward) || exchangeReward <= 0) {
          Alert.alert("Error", "Invalid reward exchange requirement.");
          return;
        }

        const quantityToDeduct = exchangeReward * exchangeQuantity;
        const ownedReward = owned_rewards.find((o) => o.rewardId === rewardId);
        const ownedNumber = ownedReward
          ? parseInt(ownedReward.quantity, 10)
          : 0;

        if (quantityToDeduct > ownedNumber) {
          Alert.alert(
            "Error",
            `You need ${quantityToDeduct} items but only have ${ownedNumber}.`
          );
          return;
        }

        await dispatch(
          createOrUpdate({
            pupilId,
            rewardId,
            quantity: -quantityToDeduct,
          })
        ).unwrap();

        console.log("createOrUpdate called, fetching owned rewards...");
        await fetchOwnedRewardsWithRetry(pupilId);

        Alert.alert("Success", "Reward exchanged successfully!");
        setSelectedReward(null);
        setQuantity("1");
      }
    } catch (error) {
      console.error("Exchange error:", error);
      Alert.alert(
        "Error",
        error.message ||
          "Failed to exchange reward or refresh data. Please try again."
      );
    } finally {
      setIsExchanging(false);
      setIsRefreshing(false);
    }
  };

  // Debounce handleExchange to prevent rapid calls
  const debouncedHandleExchange = useMemo(
    () => debounce(handleExchange, 300, { leading: true, trailing: false }),
    [handleExchange]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedHandleExchange.cancel();
    };
  }, [debouncedHandleExchange]);

  // Tạo allTargets
  const allTargets = useMemo(() => {
    if (
      !rawRewardList ||
      !Array.isArray(rawRewardList) ||
      !owned_rewards ||
      !Array.isArray(owned_rewards)
    ) {
      console.warn("Invalid input for allTargets:", {
        rawRewardList,
        owned_rewards,
      });
      return [];
    }

    const validOwnedRewards = owned_rewards.filter(
      (o) => o && typeof o === "object" && o.rewardId && o.quantity != null
    );

    if (validOwnedRewards.length !== owned_rewards.length) {
      console.warn(
        "Invalid entries detected in owned_rewards:",
        owned_rewards.filter(
          (o) =>
            !o || typeof o !== "object" || !o.rewardId || o.quantity == null
        )
      );
    }

    const targets = rawRewardList
      .filter((reward) => reward && typeof reward === "object" && reward.id)
      .map((reward) => {
        const owned = validOwnedRewards.find((o) => o?.rewardId === reward.id);
        return {
          ...reward,
          rewardId: reward.id,
          rewardImage: reward.image,
          ownedNumber: owned ? parseInt(owned.quantity, 10) : 0,
          pupilPoint: pupil ? pupil.point : 0,
        };
      })
      .filter((target) => target !== null && target?.id !== undefined);

    const unmatchedOwned = validOwnedRewards
      .filter((o) => !rawRewardList.some((r) => r && r.id === o.rewardId))
      .map((o) => ({
        id: o.rewardId,
        rewardId: o.rewardId,
        rewardImage: "https://via.placeholder.com/60",
        name: {
          vi: `Unknown Reward (${o.rewardId})`,
          en: `Unknown Reward (${o.rewardId})`,
        },
        exchangePoint: 0,
        ownedNumber: parseInt(o.quantity, 10),
        pupilPoint: pupil ? pupil.point : 0,
      }));

    const result = [...targets, ...unmatchedOwned].filter(
      (target) => target !== null && target?.id !== undefined
    );

    console.log("allTargets computed:", result);
    return result;
  }, [rawRewardList, owned_rewards, pupil]);

  const filteredTargets = allTargets;
  const selectedTarget = allTargets.find(
    (item) => item && item.id === selectedReward?.id
  );

  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20 },
    header: {
      width: "100%",
      height: "18%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      elevation: 3,
      marginBottom: 20,
    },
    backContainer: {
      position: "absolute",
      left: 10,
      backgroundColor: theme.colors.backBackgound || theme.colors.background,
      marginLeft: 20,
      padding: 8,
      borderRadius: 50,
    },
    backIcon: { width: 24, height: 24 },
    title: {
      fontSize: 36,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginHorizontal: 5,
      borderRadius: 10,
      backgroundColor: theme.colors.cardBackground,
      elevation: 3,
    },
    tabButtonActive: {
      backgroundColor: theme.colors.tabBackground || theme.colors.brandBlue,
    },
    tabText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 12,
      color: theme.colors.black,
    },
    tabTextActive: {
      color: theme.colors.white,
    },
    cardTitle: {
      width: "40%",
      alignItems: "center",
      marginHorizontal: 20,
      padding: 5,
      marginBottom: 20,
      backgroundColor: theme.colors.greenLight,
      borderRadius: 10,
      elevation: 4,
    },
    cardOwn: {
      width: "40%",
      alignItems: "center",
      marginHorizontal: 20,
      padding: 5,
      marginTop: 20,
      marginBottom: 20,
      backgroundColor: theme.colors.greenLight,
      borderRadius: 10,
      elevation: 4,
    },
    cardTitleText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
    },
    itemOwnContainer: {
      marginHorizontal: 20,
    },
    itemOwn: { alignItems: "center", marginRight: 16 },
    ownNumberContainer: {
      backgroundColor: theme.colors.cardBackground,
      paddingHorizontal: 20,
      paddingVertical: 5,
      marginTop: 10,
      borderTopLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    ownTextNumber: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
      fontSize: 14,
      textAlign: "center",
    },
    modalContainer: {
      backgroundColor: theme.colors.overlay,
    },
    modalBackground: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      padding: 20,
      backgroundColor: theme.colors.cardBackground,
    },
    modalImage: {
      width: 60,
      height: 60,
      marginBottom: 10,
    },
    modalText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
      marginVertical: 5,
      color: theme.colors.black,
    },
    soundContainer: {
      position: "absolute",
      top: 50,
      left: 20,
      zIndex: 10,
      borderRadius: 50,
      padding: 10,
    },
    closeIcon: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 10,
      borderWidth: 1,
      borderColor: theme.colors.black,
      borderRadius: 50,
    },
    closeButton: {
      marginTop: 15,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: theme.colors.red,
      borderRadius: 10,
    },
    closeButtonText: {
      color: theme.colors.white,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 30,
    },
    exchangeButton: {
      marginTop: 15,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: theme.colors.green,
      borderRadius: 10,
    },
    exchangeButtonText: {
      color: theme.colors.white,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    exchangeNumber: {
      width: 200,
      height: 40,
      backgroundColor: theme.colors.cyanLight,
      borderRadius: 30,
      padding: 10,
      marginTop: 10,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
    },
    rewardInfoText: {
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    errorContainer: {
      backgroundColor: theme.colors.red,
      padding: 10,
      marginHorizontal: 20,
      borderRadius: 10,
      marginBottom: 10,
    },
    errorText: {
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 14,
      textAlign: "center",
    },
    progressTextContainer: {
      backgroundColor: theme.colors.cardBackground,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      marginTop: 5,
      minWidth: 100,
    },
  });

  const exchangePoint = StyleSheet.create({
    cardPoint: { maxHeight: 200 },
    cardContentPoint: { alignItems: "center", marginTop: 10, marginLeft: 15 },
    rewardImageContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 16,
      padding: 8,
      alignItems: "center",
      elevation: 3,
    },
    rewardImageBackground: {
      backgroundColor: theme.colors.cardBackground,
      padding: 8,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.black,
    },
    rewardImage: { width: 40, height: 40 },
    progress: {
      width: 100,
      height: 20,
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.colors.greenLight,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    progressText: {
      position: "absolute",
      alignSelf: "center",
      fontSize: 10,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
    },
  });

  const exchangeItem = StyleSheet.create({
    cardItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      margin: 10,
      maxHeight: 180,
    },
    cardContentItem: {
      flexDirection: "row",
      justifyContent: "space-around",
      borderRadius: 10,
      margin: 10,
    },
    rewardImageContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      padding: 0,
      alignItems: "center",
    },
    rewardImageBackground: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.black,
      elevation: 3,
    },
    rewardImage: { width: 60, height: 60 },
    progress: {
      width: 150,
      height: 20,
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.colors.greenLight,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    progressText: {
      position: "absolute",
      alignSelf: "center",
      fontSize: 10,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      textAlign: "center",
    },
  });

  if (!userId) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            User data is missing. Please log in again.
          </Text>
        </View>
      </View>
    );
  }

  if (rewardLoading || pupilLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.modalText}>Loading data...</Text>
      </View>
    );
  }

  if (rewardError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading rewards:{" "}
            {rewardError?.en || rewardError?.vi || rewardError}
          </Text>
        </View>
      </View>
    );
  }

  if (pupilError && !pupil) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading pupil data:{" "}
            {pupilError?.en || pupilError?.vi || pupilError}
          </Text>
        </View>
      </View>
    );
  }

  if (!pupil || !rawRewardList) {
    return (
      <View style={styles.container}>
        <Text style={styles.modalText}>No data available</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      {owned_reward_error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading owned rewards:{" "}
            {owned_reward_error?.en ||
              owned_reward_error?.vi ||
              owned_reward_error}
          </Text>
        </View>
      )}
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={theme.icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Reward</Text>
      </LinearGradient>
      <View style={styles.tabContainer}>
        {["Exchange points", "Exchange item"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.cardTitle}>
        <Text style={styles.cardTitleText}>Rewards achieved</Text>
      </View>
      {filteredRewardList.length === 0 && (
        <Text style={styles.errorText}>No rewards available</Text>
      )}
      <FlatList
        data={allTargets.map((item) => ({
          ...item,
          ownedNumber:
            allTargets.find((item2) => item2.id === item.id)?.ownedNumber || 0,
        }))}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={selectedTab === "Exchange points" ? 3 : 1}
        key={selectedTab}
        extraData={[selectedTab, allTargets]}
        style={
          selectedTab === "Exchange points"
            ? exchangePoint.cardPoint
            : exchangeItem.cardItem
        }
        renderItem={({ item }) => {
          const progressPoint =
            item.exchangePoint > 0 && pupil?.point != null
              ? pupil.point / item.exchangePoint
              : 0;
          const ownerReward =
            item.exchangeReward !== null && item.ownedNumber !== null
              ? item.ownedNumber / item.exchangeReward
              : 0;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleRewardPress(item)}
            >
              <View
                style={
                  selectedTab === "Exchange points"
                    ? exchangePoint.cardContentPoint
                    : exchangeItem.cardContentItem
                }
              >
                <View
                  style={
                    selectedTab === "Exchange points"
                      ? exchangePoint.rewardImageContainer
                      : exchangeItem.rewardImageContainer
                  }
                >
                  <View
                    style={
                      selectedTab === "Exchange points"
                        ? exchangePoint.rewardImageBackground
                        : exchangeItem.rewardImageBackground
                    }
                  >
                    <Image
                      source={{
                        uri: item.image || "https://via.placeholder.com/60",
                      }}
                      style={
                        selectedTab === "Exchange points"
                          ? exchangePoint.rewardImage
                          : exchangeItem.rewardImage
                      }
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  {selectedTab === "Exchange points" && (
                    <View style={exchangePoint.progress}>
                      <Progress.Bar
                        progress={progressPoint}
                        height={20}
                        borderRadius={20}
                        color={theme.colors.green}
                        unfilledColor={theme.colors.progressBackground}
                        borderWidth={1}
                        borderColor={theme.colors.greenLight}
                        style={{ position: "absolute", width: "100%" }}
                      />
                      <Text style={exchangePoint.progressText}>
                        {pupil?.point ?? 0} / {item.exchangePoint}
                      </Text>
                    </View>
                  )}
                  {selectedTab === "Exchange item" && (
                    <View style={exchangeItem.progress}>
                      <Progress.Bar
                        progress={ownerReward}
                        height={20}
                        borderRadius={20}
                        color={theme.colors.green}
                        unfilledColor={theme.colors.progressBackground}
                        borderWidth={1}
                        borderColor={theme.colors.greenLight}
                        style={{ position: "absolute", width: "100%" }}
                      />
                      <Text style={exchangeItem.progressText}>
                        {item.ownedNumber ?? 0} /{" "}
                        {item.exchangeReward || "No exchange reward"}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.cardOwn}>
        <Text style={styles.cardTitleText}>Own</Text>
      </View>
      {allTargets.filter((item) => item && item.id && item.ownedNumber > 0)
        .length === 0 && (
        <Text style={styles.errorText}>
          No owned rewards. Start exchanging to earn rewards!
        </Text>
      )}
      <FlatList
        data={allTargets.filter((item) => {
          if (!item || !item.id) return null;
          const rewardData = rawRewardList.find((r) => r && r.id === item.id);
          if (!rewardData) return null;
          return item.ownedNumber > 0;
        })}
        keyExtractor={(item) => item.id.toString() + "-own"}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.itemOwnContainer}
        extraData={allTargets}
        renderItem={({ item }) => (
          <View style={styles.itemOwn}>
            <TouchableOpacity onPress={() => handleOwnRewardPress(item)}>
              <View style={exchangePoint.rewardImageBackground}>
                <Image
                  source={{
                    uri: item.rewardImage || "https://via.placeholder.com/60",
                  }}
                  style={exchangePoint.rewardImage}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.ownNumberContainer}>
              <Text style={styles.ownTextNumber}>{item.ownedNumber}</Text>
            </View>
          </View>
        )}
      />
      {selectedReward && (
        <Modal isVisible={true} onBackdropPress={() => setSelectedReward(null)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBackground}>
              {rewardLoading || isRefreshing ? (
                <Text style={styles.modalText}>Loading reward details...</Text>
              ) : rewardError ? (
                <Text style={styles.errorText}>
                  Error loading rewards:{" "}
                  {rewardError?.en || rewardError?.vi || rewardError}
                </Text>
              ) : (
                <>
                  <Image
                    source={{
                      uri:
                        selectedReward?.image ||
                        "https://via.placeholder.com/60",
                    }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.modalText}>
                    {selectedReward?.name?.en ||
                      selectedReward?.name?.vi ||
                      "Unknown Reward"}
                  </Text>
                  <Text style={styles.rewardInfoText}>
                    {selectedReward?.description?.en ||
                      selectedReward?.description?.vi ||
                      "No description available"}
                  </Text>
                  <TextInput
                    style={styles.exchangeNumber}
                    keyboardType="numeric"
                    maxLength={3}
                    onChangeText={
                      selectedTab === "Exchange points"
                        ? cardNumber
                        : rewardNumber
                    }
                    value={quantity}
                  />
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      disabled={
                        isExchanging ||
                        !isValid ||
                        (selectedTarget &&
                          selectedTab === "Exchange points" &&
                          selectedReward.exchangePoint *
                            parseInt(quantity, 10) >
                            (pupil?.point || 0)) ||
                        (selectedTab === "Exchange item" &&
                          selectedTarget &&
                          selectedReward.exchangeReward *
                            parseInt(quantity, 10) >
                            (allTargets.find(
                              (item) => item.id === selectedTarget.id
                            )?.ownedNumber || 0))
                      }
                      style={
                        isExchanging ||
                        !isValid ||
                        (selectedTarget &&
                          selectedTab === "Exchange points" &&
                          selectedReward.exchangePoint *
                            parseInt(quantity, 10) >
                            (pupil?.point || 0)) ||
                        (selectedTab === "Exchange item" &&
                          selectedTarget &&
                          selectedReward.exchangeReward *
                            parseInt(quantity, 10) >
                            (allTargets.find(
                              (item) => item.id === selectedTarget.id
                            )?.ownedNumber || 0))
                          ? {
                              ...styles.exchangeButton,
                              backgroundColor: theme.colors.grayDark,
                            }
                          : styles.exchangeButton
                      }
                      onPress={debouncedHandleExchange}
                    >
                      <Text style={styles.exchangeButtonText}>
                        {isExchanging || isRefreshing
                          ? "Exchanging..."
                          : "Exchange"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setSelectedReward(null)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}
      {selectedRewardOwn && (
        <Modal
          isVisible={true}
          onBackdropPress={() => setSelectedRewardOwn(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBackground}>
              <Image
                source={{
                  uri:
                    selectedRewardOwn?.rewardImage ||
                    "https://via.placeholder.com/60",
                }}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setSelectedRewardOwn(null)}
              >
                <Ionicons name="close" size={24} color={theme.colors.black} />
              </TouchableOpacity>
              <LinearGradient
                colors={theme.colors.gradientBlue}
                style={styles.soundContainer}
              >
                <TouchableOpacity>
                  <Ionicons
                    name="volume-high"
                    size={20}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              </LinearGradient>
              <Text style={styles.modalText}>
                {selectedRewardOwn?.name?.en ||
                  selectedRewardOwn?.name?.vi ||
                  "Unknown Reward"}
              </Text>
              <Text style={styles.rewardInfoText}>
                {(() => {
                  const reward = rawRewardList.find(
                    (r) => r && r.id === selectedRewardOwn.id
                  );
                  return (
                    reward?.description?.en ||
                    reward?.description?.vi ||
                    "No description available"
                  );
                })()}
              </Text>
            </View>
          </View>
        </Modal>
      )}
      <FloatingMenu />
    </LinearGradient>
  );
}
