"use client";

import {
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  RadioGroup,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { addAnswerApi } from "@/utils/service";
import { getSingleQuiz } from "@/utils/db";

const ShowQuiz = ({ quiz, onSubmit }) => {
  return (
    <Container
      maxW="7xl"
      mt={5}
      mb={5}
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      boxShadow="xl"
    >
      <Center flexDirection="column">
        <Heading>{quiz.title}</Heading>
      </Center>
      <Text mt={4}>{quiz.description}</Text>
      <Heading mt={4} size="lg">
        Questions:
      </Heading>
      <Divider
        mt={4}
        mb={4}
        css={{
          boxShadow: "1px 1px #888888",
        }}
      />
      <Formik initialValues={{}} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            {quiz.questions.map((singleQuiz, key) => (
              <Field name={singleQuiz.questionId} key={key}>
                {({ field, _form }) => (
                  <FormControl
                    as="fieldset"
                    isRequired={true}
                    mb={{ base: 4, md: 0 }}
                  >
                    <FormLabel as="legend">{singleQuiz.title}</FormLabel>
                    <RadioGroup>
                      <SimpleGrid minChildWidth="120px" mb={2}>
                        {singleQuiz.options.map((option, subkey) => (
                          <HStack key={subkey}>
                            <Field
                              {...field}
                              type="radio"
                              name={singleQuiz.questionId}
                              value={option.optionId}
                            />
                            <Text>{option.title}</Text>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    </RadioGroup>
                  </FormControl>
                )}
              </Field>
            ))}
            <Center mt={10}>
              <Button
                type="submit"
                isLoading={props.isSubmitting}
                colorScheme="green"
              >
                Submit
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const SingleQuiz = ({ params }) => {
  const router = useRouter();
  const { answerId } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizData = await getSingleQuiz(answerId);
      console.log(quizData);
      setQuiz(quizData);
    };
    fetchQuiz();
  }, []);

  
  const onSubmit = async (values, actions) => {
    try {
      const resp = await addAnswerApi(params.id, values);
      const answerId = resp.data.data.answerId;
      router.push(`/quiz/${params.id}/answer/${answerId}`);
    } catch (error) {
      console.log("error", error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return <>{quiz && <ShowQuiz quiz={quiz} onSubmit={onSubmit} />}</>;
};

export default SingleQuiz;