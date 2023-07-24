import SBProvider from '@sendbird/uikit-react/SendbirdProvider';
import { useMemo } from 'react';

import CustomChannel from './CustomChannel';
import { StartingPage } from './StartingPage';
import { USER_ID } from '../const';
import { useConstantState } from '../context/ConstantContext';
import SBConnectionStateProvider, {
  useSbConnectionState,
} from '../context/SBConnectionContext';
import { assert } from '../utils';

const SBComponent = () => {
  const { applicationId, botId, userNickName } = useConstantState();

  assert(
    applicationId !== null && botId !== null,
    'applicationId and botId must be provided'
  );
  const { sbConnectionStatus } = useSbConnectionState();
  const sdkInitParams = useMemo(
    () => ({
      appStateToggleEnabled: false,
    }),
    []
  );

  // Until the user sends a first message,
  // we will display a fake channel UI not to establish a connection to Sendbird Chat SDK
  // `sbConnectionStatus` will be changed to `CONNECTING` after the first message is sent
  if (sbConnectionStatus === 'INIT') {
    return <StartingPage isStartingPage={true} />;
  }

  // Once the `sbConnectionStatus` is changed to CONNECTING(and then CONNECTED),
  // we mount SBProvider to establish the connection.
  return (
    <SBProvider
      appId={applicationId}
      userId={USER_ID}
      nickname={userNickName}
      customApiHost={`https://api-${applicationId}.sendbird.com`}
      customWebSocketHost={`wss://ws-${applicationId}.sendbird.com`}
      sdkInitParams={sdkInitParams}
    >
      <>
        <CustomChannel />
        <div id={'sb_chat_root_for_z_index'} />
      </>
    </SBProvider>
  );
};

const Chat = () => {
  return (
    <SBConnectionStateProvider>
      <SBComponent />
    </SBConnectionStateProvider>
  );
};

export default Chat;
