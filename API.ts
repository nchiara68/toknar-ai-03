/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ConversationChat = {
  __typename: "ConversationChat",
  createdAt: string,
  id: string,
  messages?: ModelConversationMessageChatConnection | null,
  metadata?: string | null,
  name?: string | null,
  owner?: string | null,
  updatedAt: string,
};

export type ModelConversationMessageChatConnection = {
  __typename: "ModelConversationMessageChatConnection",
  items:  Array<ConversationMessageChat | null >,
  nextToken?: string | null,
};

export type ConversationMessageChat = {
  __typename: "ConversationMessageChat",
  aiContext?: string | null,
  associatedUserMessageId?: string | null,
  content?:  Array<AmplifyAIContentBlock | null > | null,
  conversation?: ConversationChat | null,
  conversationId: string,
  createdAt: string,
  id: string,
  owner?: string | null,
  role?: AmplifyAIConversationParticipantRole | null,
  toolConfiguration?: AmplifyAIToolConfiguration | null,
  updatedAt: string,
};

export type AmplifyAIConversationMessage = {
  __typename: "AmplifyAIConversationMessage",
  aiContext?: string | null,
  associatedUserMessageId?: string | null,
  content?:  Array<AmplifyAIContentBlock | null > | null,
  conversationId: string,
  createdAt?: string | null,
  id: string,
  owner?: string | null,
  role?: AmplifyAIConversationParticipantRole | null,
  toolConfiguration?: AmplifyAIToolConfiguration | null,
  updatedAt?: string | null,
};

export type AmplifyAIContentBlock = {
  __typename: "AmplifyAIContentBlock",
  document?: AmplifyAIDocumentBlock | null,
  image?: AmplifyAIImageBlock | null,
  text?: string | null,
  toolResult?: AmplifyAIToolResultBlock | null,
  toolUse?: AmplifyAIToolUseBlock | null,
};

export type AmplifyAIDocumentBlock = {
  __typename: "AmplifyAIDocumentBlock",
  format: string,
  name: string,
  source: AmplifyAIDocumentBlockSource,
};

export type AmplifyAIDocumentBlockSource = {
  __typename: "AmplifyAIDocumentBlockSource",
  bytes?: string | null,
};

export type AmplifyAIImageBlock = {
  __typename: "AmplifyAIImageBlock",
  format: string,
  source: AmplifyAIImageBlockSource,
};

export type AmplifyAIImageBlockSource = {
  __typename: "AmplifyAIImageBlockSource",
  bytes?: string | null,
};

export type AmplifyAIToolResultBlock = {
  __typename: "AmplifyAIToolResultBlock",
  content:  Array<AmplifyAIToolResultContentBlock >,
  status?: string | null,
  toolUseId: string,
};

export type AmplifyAIToolResultContentBlock = {
  __typename: "AmplifyAIToolResultContentBlock",
  document?: AmplifyAIDocumentBlock | null,
  image?: AmplifyAIImageBlock | null,
  json?: string | null,
  text?: string | null,
};

export type AmplifyAIToolUseBlock = {
  __typename: "AmplifyAIToolUseBlock",
  input: string,
  name: string,
  toolUseId: string,
};

export enum AmplifyAIConversationParticipantRole {
  assistant = "assistant",
  user = "user",
}


export type AmplifyAIToolConfiguration = {
  __typename: "AmplifyAIToolConfiguration",
  tools?:  Array<AmplifyAITool | null > | null,
};

export type AmplifyAITool = {
  __typename: "AmplifyAITool",
  toolSpec?: AmplifyAIToolSpecification | null,
};

export type AmplifyAIToolSpecification = {
  __typename: "AmplifyAIToolSpecification",
  description?: string | null,
  inputSchema: AmplifyAIToolInputSchema,
  name: string,
};

export type AmplifyAIToolInputSchema = {
  __typename: "AmplifyAIToolInputSchema",
  json?: string | null,
};

export type ModelConversationChatFilterInput = {
  and?: Array< ModelConversationChatFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  metadata?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelConversationChatFilterInput | null,
  or?: Array< ModelConversationChatFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelConversationChatConnection = {
  __typename: "ModelConversationChatConnection",
  items:  Array<ConversationChat | null >,
  nextToken?: string | null,
};

export type ModelConversationMessageChatFilterInput = {
  aiContext?: ModelStringInput | null,
  and?: Array< ModelConversationMessageChatFilterInput | null > | null,
  associatedUserMessageId?: ModelIDInput | null,
  conversationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelConversationMessageChatFilterInput | null,
  or?: Array< ModelConversationMessageChatFilterInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelAmplifyAIConversationParticipantRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAmplifyAIConversationParticipantRoleInput = {
  eq?: AmplifyAIConversationParticipantRole | null,
  ne?: AmplifyAIConversationParticipantRole | null,
};

export type AmplifyAIContentBlockInput = {
  document?: AmplifyAIDocumentBlockInput | null,
  image?: AmplifyAIImageBlockInput | null,
  text?: string | null,
  toolResult?: AmplifyAIToolResultBlockInput | null,
  toolUse?: AmplifyAIToolUseBlockInput | null,
};

export type AmplifyAIDocumentBlockInput = {
  format: string,
  name: string,
  source: AmplifyAIDocumentBlockSourceInput,
};

export type AmplifyAIDocumentBlockSourceInput = {
  bytes?: string | null,
};

export type AmplifyAIImageBlockInput = {
  format: string,
  source: AmplifyAIImageBlockSourceInput,
};

export type AmplifyAIImageBlockSourceInput = {
  bytes?: string | null,
};

export type AmplifyAIToolResultBlockInput = {
  content: Array< AmplifyAIToolResultContentBlockInput >,
  status?: string | null,
  toolUseId: string,
};

export type AmplifyAIToolResultContentBlockInput = {
  document?: AmplifyAIDocumentBlockInput | null,
  image?: AmplifyAIImageBlockInput | null,
  json?: string | null,
  text?: string | null,
};

export type AmplifyAIToolUseBlockInput = {
  input: string,
  name: string,
  toolUseId: string,
};

export type AmplifyAIToolConfigurationInput = {
  tools?: Array< AmplifyAIToolInput | null > | null,
};

export type AmplifyAIToolInput = {
  toolSpec?: AmplifyAIToolSpecificationInput | null,
};

export type AmplifyAIToolSpecificationInput = {
  description?: string | null,
  inputSchema: AmplifyAIToolInputSchemaInput,
  name: string,
};

export type AmplifyAIToolInputSchemaInput = {
  json?: string | null,
};

export type CreateConversationMessageChatAssistantInput = {
  associatedUserMessageId?: string | null,
  content?: Array< AmplifyAIContentBlockInput | null > | null,
  conversationId?: string | null,
};

export type CreateConversationMessageChatAssistantStreamingInput = {
  accumulatedTurnContent?: Array< AmplifyAIContentBlockInput | null > | null,
  associatedUserMessageId: string,
  contentBlockDeltaIndex?: number | null,
  contentBlockDoneAtIndex?: number | null,
  contentBlockIndex?: number | null,
  contentBlockText?: string | null,
  contentBlockToolUse?: string | null,
  conversationId: string,
  errors?: Array< AmplifyAIConversationTurnErrorInput | null > | null,
  p?: string | null,
  stopReason?: string | null,
};

export type AmplifyAIConversationTurnErrorInput = {
  errorType: string,
  message: string,
};

export type AmplifyAIConversationMessageStreamPart = {
  __typename: "AmplifyAIConversationMessageStreamPart",
  associatedUserMessageId: string,
  contentBlockDeltaIndex?: number | null,
  contentBlockDoneAtIndex?: number | null,
  contentBlockIndex?: number | null,
  contentBlockText?: string | null,
  contentBlockToolUse?: AmplifyAIToolUseBlock | null,
  conversationId: string,
  errors?:  Array<AmplifyAIConversationTurnError | null > | null,
  id: string,
  owner?: string | null,
  p?: string | null,
  stopReason?: string | null,
};

export type AmplifyAIConversationTurnError = {
  __typename: "AmplifyAIConversationTurnError",
  errorType: string,
  message: string,
};

export type ModelConversationChatConditionInput = {
  and?: Array< ModelConversationChatConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  metadata?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelConversationChatConditionInput | null,
  or?: Array< ModelConversationChatConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateConversationChatInput = {
  id?: string | null,
  metadata?: string | null,
  name?: string | null,
};

export type ModelConversationMessageChatConditionInput = {
  aiContext?: ModelStringInput | null,
  and?: Array< ModelConversationMessageChatConditionInput | null > | null,
  associatedUserMessageId?: ModelIDInput | null,
  conversationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelConversationMessageChatConditionInput | null,
  or?: Array< ModelConversationMessageChatConditionInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelAmplifyAIConversationParticipantRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateConversationMessageChatInput = {
  aiContext?: string | null,
  associatedUserMessageId?: string | null,
  content?: Array< AmplifyAIContentBlockInput | null > | null,
  conversationId: string,
  id?: string | null,
  role?: AmplifyAIConversationParticipantRole | null,
  toolConfiguration?: AmplifyAIToolConfigurationInput | null,
};

export type DeleteConversationChatInput = {
  id: string,
};

export type DeleteConversationMessageChatInput = {
  id: string,
};

export type UpdateConversationChatInput = {
  id: string,
  metadata?: string | null,
  name?: string | null,
};

export type ModelSubscriptionConversationMessageChatFilterInput = {
  aiContext?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionConversationMessageChatFilterInput | null > | null,
  associatedUserMessageId?: ModelSubscriptionIDInput | null,
  conversationId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionConversationMessageChatFilterInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type GetConversationChatQueryVariables = {
  id: string,
};

export type GetConversationChatQuery = {
  getConversationChat?:  {
    __typename: "ConversationChat",
    createdAt: string,
    id: string,
    messages?:  {
      __typename: "ModelConversationMessageChatConnection",
      nextToken?: string | null,
    } | null,
    metadata?: string | null,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetConversationMessageChatQueryVariables = {
  id: string,
};

export type GetConversationMessageChatQuery = {
  getConversationMessageChat?:  {
    __typename: "ConversationMessageChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type ListConversationChatsQueryVariables = {
  filter?: ModelConversationChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListConversationChatsQuery = {
  listConversationChats?:  {
    __typename: "ModelConversationChatConnection",
    items:  Array< {
      __typename: "ConversationChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListConversationMessageChatsQueryVariables = {
  filter?: ModelConversationMessageChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListConversationMessageChatsQuery = {
  listConversationMessageChats?:  {
    __typename: "ModelConversationMessageChatConnection",
    items:  Array< {
      __typename: "ConversationMessageChat",
      aiContext?: string | null,
      associatedUserMessageId?: string | null,
      conversationId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      role?: AmplifyAIConversationParticipantRole | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ChatMutationVariables = {
  aiContext?: string | null,
  content?: Array< AmplifyAIContentBlockInput | null > | null,
  conversationId: string,
  toolConfiguration?: AmplifyAIToolConfigurationInput | null,
};

export type ChatMutation = {
  chat: ( {
      __typename: "ConversationMessageChat",
      aiContext?: string | null,
      associatedUserMessageId?: string | null,
      content?:  Array< {
        __typename: "AmplifyAIContentBlock",
        text?: string | null,
      } | null > | null,
      conversationId: string,
      createdAt?: string | null,
      id: string,
      owner?: string | null,
      role?: AmplifyAIConversationParticipantRole | null,
      toolConfiguration?:  {
        __typename: "AmplifyAIToolConfiguration",
      } | null,
      updatedAt?: string | null,
      conversation?:  {
        __typename: "ConversationChat",
        createdAt: string,
        id: string,
        metadata?: string | null,
        name?: string | null,
        owner?: string | null,
        updatedAt: string,
      } | null,
    }
  ) | null,
};

export type CreateAssistantResponseChatMutationVariables = {
  input: CreateConversationMessageChatAssistantInput,
};

export type CreateAssistantResponseChatMutation = {
  createAssistantResponseChat?:  {
    __typename: "ConversationMessageChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateAssistantResponseStreamChatMutationVariables = {
  input: CreateConversationMessageChatAssistantStreamingInput,
};

export type CreateAssistantResponseStreamChatMutation = {
  createAssistantResponseStreamChat?:  {
    __typename: "AmplifyAIConversationMessageStreamPart",
    associatedUserMessageId: string,
    contentBlockDeltaIndex?: number | null,
    contentBlockDoneAtIndex?: number | null,
    contentBlockIndex?: number | null,
    contentBlockText?: string | null,
    contentBlockToolUse?:  {
      __typename: "AmplifyAIToolUseBlock",
      input: string,
      name: string,
      toolUseId: string,
    } | null,
    conversationId: string,
    errors?:  Array< {
      __typename: "AmplifyAIConversationTurnError",
      errorType: string,
      message: string,
    } | null > | null,
    id: string,
    owner?: string | null,
    p?: string | null,
    stopReason?: string | null,
  } | null,
};

export type CreateConversationChatMutationVariables = {
  condition?: ModelConversationChatConditionInput | null,
  input: CreateConversationChatInput,
};

export type CreateConversationChatMutation = {
  createConversationChat?:  {
    __typename: "ConversationChat",
    createdAt: string,
    id: string,
    messages?:  {
      __typename: "ModelConversationMessageChatConnection",
      nextToken?: string | null,
    } | null,
    metadata?: string | null,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateConversationMessageChatMutationVariables = {
  condition?: ModelConversationMessageChatConditionInput | null,
  input: CreateConversationMessageChatInput,
};

export type CreateConversationMessageChatMutation = {
  createConversationMessageChat?:  {
    __typename: "ConversationMessageChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteConversationChatMutationVariables = {
  condition?: ModelConversationChatConditionInput | null,
  input: DeleteConversationChatInput,
};

export type DeleteConversationChatMutation = {
  deleteConversationChat?:  {
    __typename: "ConversationChat",
    createdAt: string,
    id: string,
    messages?:  {
      __typename: "ModelConversationMessageChatConnection",
      nextToken?: string | null,
    } | null,
    metadata?: string | null,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteConversationMessageChatMutationVariables = {
  condition?: ModelConversationMessageChatConditionInput | null,
  input: DeleteConversationMessageChatInput,
};

export type DeleteConversationMessageChatMutation = {
  deleteConversationMessageChat?:  {
    __typename: "ConversationMessageChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type ExtractTextMutationVariables = {
  bucket?: string | null,
  key?: string | null,
};

export type ExtractTextMutation = {
  extractText?: string | null,
};

export type UpdateConversationChatMutationVariables = {
  condition?: ModelConversationChatConditionInput | null,
  input: UpdateConversationChatInput,
};

export type UpdateConversationChatMutation = {
  updateConversationChat?:  {
    __typename: "ConversationChat",
    createdAt: string,
    id: string,
    messages?:  {
      __typename: "ModelConversationMessageChatConnection",
      nextToken?: string | null,
    } | null,
    metadata?: string | null,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateAssistantResponseChatSubscriptionVariables = {
  conversationId?: string | null,
};

export type OnCreateAssistantResponseChatSubscription = {
  onCreateAssistantResponseChat?:  {
    __typename: "AmplifyAIConversationMessageStreamPart",
    associatedUserMessageId: string,
    contentBlockDeltaIndex?: number | null,
    contentBlockDoneAtIndex?: number | null,
    contentBlockIndex?: number | null,
    contentBlockText?: string | null,
    contentBlockToolUse?:  {
      __typename: "AmplifyAIToolUseBlock",
      input: string,
      name: string,
      toolUseId: string,
    } | null,
    conversationId: string,
    errors?:  Array< {
      __typename: "AmplifyAIConversationTurnError",
      errorType: string,
      message: string,
    } | null > | null,
    id: string,
    owner?: string | null,
    p?: string | null,
    stopReason?: string | null,
  } | null,
};

export type OnCreateConversationMessageChatSubscriptionVariables = {
  filter?: ModelSubscriptionConversationMessageChatFilterInput | null,
  owner?: string | null,
};

export type OnCreateConversationMessageChatSubscription = {
  onCreateConversationMessageChat?:  {
    __typename: "ConversationMessageChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};
