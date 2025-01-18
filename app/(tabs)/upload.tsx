import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BskyAgent } from '@atproto/api';

export default function Upload() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const uploadVideo = async () => {
    if (!videoUri) return;

    const agent = new BskyAgent({
      service: 'https://bsky.social',
    });

    await agent.login({
      identifier: process.env.ATPROTO_USERNAME as string,
      password: process.env.ATPROTO_PASSWORD as string,
    });

    // Convert video to blob and upload
    const response = await fetch(videoUri);
    const blob = await response.blob();

    await agent.uploadBlob(blob, {
      encoding: 'video/mp4',
    });

    // Create post with video
    await agent.post({
      text: caption,
      embed: {
        $type: 'app.bsky.embed.images',
        images: [{
          image: blob,
          alt: '',
        }],
      },
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a video" onPress={pickVideo} />
      {videoUri && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Add a caption..."
            value={caption}
            onChangeText={setCaption}
          />
          <Button title="Upload" onPress={uploadVideo} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
});