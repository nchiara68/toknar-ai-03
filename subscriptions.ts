/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAssistantResponseChat = /* GraphQL */ `subscription OnCreateAssistantResponseChat($conversationId: ID) {
  onCreateAssistantResponseChat(conversationId: $conversationId) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAssistantResponseChatSubscriptionVariables,
  APITypes.OnCreateAssistantResponseChatSubscription
>;
export const onCreateConversationMessageChat = /* GraphQL */ `subscription OnCreateConversationMessageChat(
  $filter: ModelSubscriptionConversationMessageChatFilterInput
  $owner: String
) {
  onCreateConversationMessageChat(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateConversationMessageChatSubscriptionVariables,
  APITypes.OnCreateConversationMessageChatSubscription
>;
