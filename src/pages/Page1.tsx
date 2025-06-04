// src/pages/Home.tsx
import React from 'react';
import {
  View,
  Heading,
  Text,
  useTheme
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Home: React.FC = () => {
  const { tokens } = useTheme();

  return (
    <View
      padding={tokens.space.large}
      backgroundColor="#ffffff"
      height="100vh"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Heading level={1} color="black">
        🏡 Welcome to the Page 1!
      </Heading>
      <Text
        fontSize={tokens.fontSizes.large}
        marginTop={tokens.space.medium}
        color="black" // ✅ white text
      >
        This is a basic test page using Amplify UI.
      </Text>
    </View>
  );
};

export default Home;
