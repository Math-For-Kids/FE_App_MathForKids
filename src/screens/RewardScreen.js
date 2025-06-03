import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import * as Progress from "react-native-progress";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import FloatingMenu from "../components/FloatingMenu";
export default function RewardScreen({ navigation }) {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("Exchange points");
  const [selectedReward, setSelectedReward] = useState(null);
  const [selectedRewardOwn, setSelectedRewardOwn] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    if (selectedTab === "Exchange points") {
      setQuantity("10");
    } else if (selectedTab === "Exchange item") {
      setQuantity("1");
    }
  }, [selectedTab]);

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

  const rewardNumber = () => {
    setQuantity("1");
  };

  const rewards = [
    {
      id: 1,
      description:
        "Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewardsComplete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!Complete this lesson to earn rewards!",
      image: theme.images.characterHeart,
      name: "Capybara",
      type: "Card",
      rewardPoint: 200,
    },
    {
      id: 2,
      description: "Complete this lesson to earn rewards!",
      image: theme.images.characterSandwich,
      name: "Capybara",
      type: "Card",
      rewardPoint: 100,
    },
    {
      id: 3,
      description: "Complete this lesson to earn rewards!",
      image: theme.images.characterSandwich,
      name: "Capybara",
      type: "Card",
      rewardPoint: 100,
    },
    {
      id: 6,
      description: "Complete this lesson to earn rewards!",
      image: theme.images.characterSandwich,
      name: "Capybara",
      type: "Card",
      rewardPoint: 100,
    },
    {
      id: 4,
      description: "Complete this lesson to earn rewards!",
      image: theme.images.characterSandwich,
      name: "Capybara",
      type: "Real",
      rewardPoint: 1000,
    },
    {
      id: 5,
      description: "Complete this lesson to earn rewards ok!",
      image: theme.images.characterSandwich,
      name: "Capybara",
      type: "Real",
      rewardPoint: 1000,
    },
    {
      id: 7,
      description: "Complete this lesson to earn rewards ok!",
      image: theme.images.characterSandwich,
      name: "Capybara",
      type: "Real",
      rewardPoint: 1000,
    },
    {
      id: 8,
      description: "Complete this lesson to earn rewards ok!",
      image: theme.images.characterSandwich,
      name: "Capybara",
      type: "Real",
      rewardPoint: 1000,
    },
  ];

  const owned_rewards = [
    { id: 1, rewardId: 1, number: 2, point: 100 },
    { id: 2, rewardId: 2, number: 2, point: 1000 },
    { id: 3, rewardId: 3, number: 2, point: 1000 },
    { id: 4, rewardId: 4, number: 2, point: 1000 },
    { id: 5, rewardId: 5, number: 2, point: 100 },
    { id: 6, rewardId: 6, number: 2, point: 1 },
  ];

  const allTargets = rewards.map((reward) => {
    const owned = owned_rewards.find((o) => o.rewardId === reward.id);
    return {
      ...reward,
      rewardId: reward.id,
      rewardImage: reward.image,
      ownedNumber: owned?.number || 0,
      ownedPoint: owned?.point || 0,
    };
  });

  const filteredTargets = allTargets.filter((item) => {
    if (selectedTab === "Exchange points") {
      return item.type === "Card";
    } else {
      return item.type === "Real";
    }
  });

  const selectedTarget = allTargets.find(
    (item) => item.id === selectedReward?.id
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
      backgroundColor: theme.colors.backBackgound,
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
      backgroundColor: theme.colors.tabBackground,
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
    },
    rewardInfoText: { color: theme.colors.black },
  });

  const exchangePoint = StyleSheet.create({
    cardPoint: {
      maxHeight: 200,
    },
    cardContentPoint: {
      alignItems: "center",
      marginTop: 10,
      marginLeft: 15,
    },
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
    rewardImage: {
      width: 40,
      height: 40,
    },
    progress: {
      width: 100,
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.colors.greenLight,
    },
    progressText: {
      position: "absolute",
      alignSelf: "center",
      fontSize: 10,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      marginTop: 13,
    },
  });
  const exchangeItem = StyleSheet.create({
    cardItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      margin: 10,
      maxHeight: 200,
    },
    cardContentItem: {
      flexDirection: "row",
      justifyContent: "space-around",
      borderRadius: 10,
      margin: 10,
    },
    rewardImageBackground: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.black,
      elevation: 3,
    },
    rewardImage: {
      width: 60,
      height: 60,
    },
    progress: {
      width: 200,
      marginTop: 25,
      borderWidth: 1,
      borderColor: theme.colors.greenLight,
    },
    progressText: {
      position: "absolute",
      alignSelf: "center",
      fontSize: 10,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      textAlign: "center",
      marginTop: 28,
    },
  });
  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
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
      {/* Reward list */}
      <View style={styles.cardTitle}>
        <Text style={styles.cardTitleText}>Rewards achieved</Text>
      </View>
      <FlatList
        data={filteredTargets}
        keyExtractor={(item) => item.rewardId.toString()}
        numColumns={selectedTab === "Exchange points" ? 3 : 1}
        key={selectedTab}
        style={
          selectedTab === "Exchange points"
            ? exchangePoint.cardPoint
            : exchangeItem.cardItem
        }
        renderItem={({ item }) => {
          const progress =
            item.rewardPoint > 0 ? item.ownedPoint / item.rewardPoint : 0;
          const adjustedProgress = progress < 0.015 ? 0.015 : progress;
          return (
            <TouchableOpacity onPress={() => setSelectedReward(item)}>
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
                      source={item.rewardImage}
                      style={
                        selectedTab === "Exchange points"
                          ? exchangePoint.rewardImage
                          : exchangeItem.rewardImage
                      }
                      resizeMode="contain"
                    />
                  </View>
                </View>

                <View>
                  <Progress.Bar
                    progress={adjustedProgress}
                    height={20}
                    borderRadius={20}
                    color={theme.colors.green}
                    unfilledColor={theme.colors.progressBackground}
                    borderWidth={selectedTab === "Exchange points" ? 25 : -25}
                    style={
                      selectedTab === "Exchange points"
                        ? exchangePoint.progress
                        : exchangeItem.progress
                    }
                  />

                  <Text
                    style={
                      selectedTab === "Exchange points"
                        ? exchangePoint.progressText
                        : exchangeItem.progressText
                    }
                  >
                    {item.ownedPoint} / {item.rewardPoint}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {/* Own list */}
      <View style={styles.cardOwn}>
        <Text style={styles.cardTitleText}>Own</Text>
      </View>
      <FlatList
        data={allTargets.filter((item) => {
          const isOwned = item.ownedNumber > 0;
          const rewardData = rewards.find((r) => r.id === item.rewardId);
          const rewardType = rewardData?.type;
          const isCardType =
            selectedTab === "Exchange points"
              ? rewardType === "Card"
              : rewardType === "Real";

          return isOwned && isCardType;
        })}
        keyExtractor={(item) => item.rewardId.toString() + "-own"}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.itemOwnContainer}
        renderItem={({ item }) => (
          <View style={styles.itemOwn}>
            <TouchableOpacity onPress={() => handleOwnRewardPress(item)}>
              <View
                style={
                  selectedTab === "Exchange points"
                    ? exchangePoint.rewardImageBackground
                    : exchangeItem.rewardImageBackground
                }
              >
                <Image
                  source={item.rewardImage}
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
      {/* Modal selectedReward */}
      {selectedReward && (
        <Modal isVisible={true} onBackdropPress={() => setSelectedReward(null)}>
          <View
            style={
              selectedTab === "Exchange points"
                ? styles.modalContainer
                : styles.modalContainer
            }
          >
            <View
              style={
                selectedTab === "Exchange points"
                  ? styles.modalBackground
                  : styles.modalBackground
              }
            >
              <Image
                Image
                source={selectedReward.rewardImage}
                style={
                  selectedTab === "Exchange points"
                    ? styles.modalImage
                    : styles.modalImage
                }
                resizeMode="contain"
              />
              <Text
                style={
                  selectedTab === "Exchange points"
                    ? styles.modalText
                    : styles.modalText
                }
              >
                {selectedReward.name}
              </Text>
              <TextInput
                style={
                  selectedTab === "Exchange points"
                    ? styles.exchangeNumber
                    : styles.exchangeNumber
                }
                keyboardType="numeric"
                maxLength={3}
                onChangeText={
                  selectedTab === "Exchange points" ? cardNumber : rewardNumber
                }
                value={quantity}
                color={theme.colors.black}
              />
              <View
                style={
                  selectedTab === "Exchange points"
                    ? styles.buttonContainer
                    : styles.buttonContainer
                }
              >
                <TouchableOpacity
                  disabled={!isValid}
                  style={[
                    styles.exchangeButton,
                    (!isValid ||
                      (selectedTarget &&
                        selectedTarget.rewardPoint >
                          selectedTarget.ownedPoint)) && {
                      backgroundColor: theme.colors.grayDark,
                    },
                  ]}
                >
                  <Text
                    style={
                      selectedTab === "Exchange points"
                        ? styles.exchangeButtonText
                        : styles.exchangeButtonText
                    }
                  >
                    Exchange
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    selectedTab === "Exchange points"
                      ? styles.closeButton
                      : styles.closeButton
                  }
                  onPress={() => setSelectedReward(null)}
                >
                  <Text
                    style={
                      selectedTab === "Exchange points"
                        ? styles.closeButtonText
                        : styles.closeButtonText
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {/* Modal selectedRewardOwn */}
      {selectedRewardOwn &&
        (() => {
          const selectedDescription = rewards.find(
            (r) => r.id === selectedRewardOwn.rewardId
          )?.description;

          return (
            <Modal
              isVisible={true}
              onBackdropPress={() => setSelectedRewardOwn(null)}
            >
              <View
                style={
                  selectedTab === "Exchange points"
                    ? styles.modalContainer
                    : styles.modalContainer
                }
              >
                <View
                  style={
                    selectedTab === "Exchange points"
                      ? styles.modalBackground
                      : styles.modalBackground
                  }
                >
                  <Image
                    source={selectedRewardOwn.rewardImage}
                    style={
                      selectedTab === "Exchange points"
                        ? styles.modalImage
                        : styles.modalImage
                    }
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={() => setSelectedRewardOwn(null)}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.black}
                    />
                  </TouchableOpacity>
                  <LinearGradient
                    colors={theme.colors.gradientBlue}
                    style={styles.soundContainer}
                  >
                    <TouchableOpacity
                    // onPress={() => setSelectedRewardOwn(null)}
                    >
                      <View style={styles.soundIcon}>
                        <Ionicons
                          name="volume-high"
                          size={20}
                          color={theme.colors.white}
                        />
                      </View>
                    </TouchableOpacity>
                  </LinearGradient>
                  <Text
                    style={
                      selectedTab === "Exchange points"
                        ? styles.modalText
                        : styles.modalText
                    }
                  >
                    {selectedRewardOwn.name}
                  </Text>
                  {selectedDescription && (
                    <Text style={styles.rewardInfoText}>
                      {selectedDescription}
                    </Text>
                  )}
                  <View
                    style={
                      selectedTab === "Exchange points"
                        ? styles.buttonContainer
                        : styles.buttonContainer
                    }
                  ></View>
                </View>
              </View>
            </Modal>
          );
        })()}
      <FloatingMenu />
    </LinearGradient>
  );
}
