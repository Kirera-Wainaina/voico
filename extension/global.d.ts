interface ChromeMessage {
  name: string;
  content?: any;
}

interface ISessionState {
  user_media_is_setup?: boolean;
  recording?: boolean;
  permission_granted?: boolean
}

interface ILocalState {
  language?: string;
  APIKey?: string;
  enabledStreaming?: boolean
}