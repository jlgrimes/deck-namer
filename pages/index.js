import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { RingLoader } from "react-spinners";
import { Text, Box, ChakraProvider, ScaleFade, Fade, Flex, Stack, Heading } from "@chakra-ui/react";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChakraProvider>
      <main className={styles.main}>
        <Fade in>
          <Stack paddingX={6}>
            <Heading color='gray.700' paddingBottom={4}>deck namer</Heading>
            <Text>Enter a comma-separated list of Pokemon names to create your next deck name.</Text>
            <Text width='60vw' paddingBottom={2}>Made by Jared Grimes. Powered by ChatGPT.</Text>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="animal"
                placeholder="Pokemon - ex. Lugia, Archeops"
                value={animalInput}
                onChange={(e) => setAnimalInput(e.target.value)}
              />
              <input type="submit" value="Generate name" />
            </form>
            <Flex paddingY={4} height='100px' transitionTimingFunction={'ease'} transitionDuration={2}>
              <Box position={'absolute'} left='16px'>
                <Fade initialScale={0.9} in={loading}>
                  <RingLoader color='#36d7b7' />
                </Fade>
              </Box>
              <ScaleFade initialScale={0.9} in={!loading}>
                <Box paddingY={4}>
                  <div className={styles.result}>{result}</div>
                </Box>
              </ScaleFade>
            </Flex>
          </Stack>
        </Fade>
      </main>
    </ChakraProvider>
  );
}
