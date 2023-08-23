import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import axios from "axios";

import { styles } from "./styles";

import { SCORE_TAG, Sentiment } from "../../components/Sentiment";

export function Home() {
  const [score, setScore] = useState<SCORE_TAG | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendMessage() {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("key", `${process.env.EXPO_PUBLIC_API_AUTHORIZATION}`);
      formData.append("txt", message);
      formData.append("lang", "pt");

      const response = await axios.post(
        "https://api.meaningcloud.com/sentiment-2.1",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setScore(response.data.score_tag);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mensagem</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Digite a sua mensagem..."
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          disabled={isLoading}
          onPress={handleSendMessage}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <FontAwesome name="send" size={24} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>

      {score && <Sentiment score={score} />}
    </View>
  );
}
