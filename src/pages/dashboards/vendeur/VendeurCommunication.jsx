import React from 'react';
import VendeurMessagesRealData from './VendeurMessagesRealData';

const VendeurCommunication = ({ onUnreadChange }) => {
  return <VendeurMessagesRealData onUnreadChange={onUnreadChange} />;
};

export default VendeurCommunication;

