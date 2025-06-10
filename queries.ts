/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getConversationChat = /* GraphQL */ `query GetConversationChat($id: ID!) {
  getConversationChat(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConversationChatQueryVariables,
  APITypes.GetConversationChatQuery
>;
export const getConversationMessageChat = /* GraphQL */ `query GetConversationMessageChat($id: ID!) {
  getConversationMessageChat(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConversationMessageChatQueryVariables,
  APITypes.GetConversationMessageChatQuery
>;
export const listConversationChats = /* GraphQL */ `query ListConversationChats(
  $filter: ModelConversationChatFilterInput
  $limit: Int
  $nextToken: String
) {
  listConversationChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      metadata
      name
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConversationChatsQueryVariables,
  APITypes.ListConversationChatsQuery
>;
export const listConversationMessageChats = /* GraphQL */ `query ListConversationMessageChats(
  $filter: ModelConversationMessageChatFilterInput
  $limit: Int
  $nextToken: String
) {
  listConversationMessageChats(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      aiContext
      associatedUserMessageId
      conversationId
      createdAt
      id
      owner
      role
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConversationMessageChatsQueryVariables,
  APITypes.ListConversationMessageChatsQuery
>;
