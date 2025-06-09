/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const chat = /* GraphQL */ `mutation Chat(
  $aiContext: AWSJSON
  $content: [AmplifyAIContentBlockInput]
  $conversationId: ID!
  $toolConfiguration: AmplifyAIToolConfigurationInput
) {
  chat(
    aiContext: $aiContext
    content: $content
    conversationId: $conversationId
    toolConfiguration: $toolConfiguration
  ) {
    aiContext
    associatedUserMessageId
    content {
      text
      __typename
    }
    conversationId
    createdAt
    id
    owner
    role
    toolConfiguration {
      __typename
    }
    updatedAt

    ... on ConversationMessageChat {
      conversation {
        createdAt
        id
        metadata
        name
        owner
        updatedAt
        __typename
      }
    }
  }
}
` as GeneratedMutation<APITypes.ChatMutationVariables, APITypes.ChatMutation>;
export const createAssistantResponseChat = /* GraphQL */ `mutation CreateAssistantResponseChat(
  $input: CreateConversationMessageChatAssistantInput!
) {
  createAssistantResponseChat(input: $input) {
    aiContext
    associatedUserMessageId
    content {
      text
      __typename
    }
    conversation {
      createdAt
      id
      metadata
      name
      owner
      updatedAt
      __typename
    }
    conversationId
    createdAt
    id
    owner
    role
    toolConfiguration {
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAssistantResponseChatMutationVariables,
  APITypes.CreateAssistantResponseChatMutation
>;
export const createAssistantResponseStreamChat = /* GraphQL */ `mutation CreateAssistantResponseStreamChat(
  $input: CreateConversationMessageChatAssistantStreamingInput!
) {
  createAssistantResponseStreamChat(input: $input) {
    associatedUserMessageId
    contentBlockDeltaIndex
    contentBlockDoneAtIndex
    contentBlockIndex
    contentBlockText
    contentBlockToolUse {
      input
      name
      toolUseId
      __typename
    }
    conversationId
    errors {
      errorType
      message
      __typename
    }
    id
    owner
    p
    stopReason
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAssistantResponseStreamChatMutationVariables,
  APITypes.CreateAssistantResponseStreamChatMutation
>;
export const createConversationChat = /* GraphQL */ `mutation CreateConversationChat(
  $condition: ModelConversationChatConditionInput
  $input: CreateConversationChatInput!
) {
  createConversationChat(condition: $condition, input: $input) {
    createdAt
    id
    messages {
      nextToken
      __typename
    }
    metadata
    name
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateConversationChatMutationVariables,
  APITypes.CreateConversationChatMutation
>;
export const createConversationMessageChat = /* GraphQL */ `mutation CreateConversationMessageChat(
  $condition: ModelConversationMessageChatConditionInput
  $input: CreateConversationMessageChatInput!
) {
  createConversationMessageChat(condition: $condition, input: $input) {
    aiContext
    associatedUserMessageId
    content {
      text
      __typename
    }
    conversation {
      createdAt
      id
      metadata
      name
      owner
      updatedAt
      __typename
    }
    conversationId
    createdAt
    id
    owner
    role
    toolConfiguration {
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateConversationMessageChatMutationVariables,
  APITypes.CreateConversationMessageChatMutation
>;
export const deleteConversationChat = /* GraphQL */ `mutation DeleteConversationChat(
  $condition: ModelConversationChatConditionInput
  $input: DeleteConversationChatInput!
) {
  deleteConversationChat(condition: $condition, input: $input) {
    createdAt
    id
    messages {
      nextToken
      __typename
    }
    metadata
    name
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteConversationChatMutationVariables,
  APITypes.DeleteConversationChatMutation
>;
export const deleteConversationMessageChat = /* GraphQL */ `mutation DeleteConversationMessageChat(
  $condition: ModelConversationMessageChatConditionInput
  $input: DeleteConversationMessageChatInput!
) {
  deleteConversationMessageChat(condition: $condition, input: $input) {
    aiContext
    associatedUserMessageId
    content {
      text
      __typename
    }
    conversation {
      createdAt
      id
      metadata
      name
      owner
      updatedAt
      __typename
    }
    conversationId
    createdAt
    id
    owner
    role
    toolConfiguration {
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteConversationMessageChatMutationVariables,
  APITypes.DeleteConversationMessageChatMutation
>;
export const extractText = /* GraphQL */ `mutation ExtractText($bucket: String, $key: String) {
  extractText(bucket: $bucket, key: $key)
}
` as GeneratedMutation<
  APITypes.ExtractTextMutationVariables,
  APITypes.ExtractTextMutation
>;
export const updateConversationChat = /* GraphQL */ `mutation UpdateConversationChat(
  $condition: ModelConversationChatConditionInput
  $input: UpdateConversationChatInput!
) {
  updateConversationChat(condition: $condition, input: $input) {
    createdAt
    id
    messages {
      nextToken
      __typename
    }
    metadata
    name
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateConversationChatMutationVariables,
  APITypes.UpdateConversationChatMutation
>;
