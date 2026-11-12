'use strict';

const { createApp } = require('../backend/app');

let appPromise;

function getApp() {
  if (!appPromise) {
    appPromise = createApp().catch(error => {
      appPromise = undefined;
      throw error;
    });
  }
  return appPromise;
}

module.exports = async function handler(req, res) {
  const app = await getApp();
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      res.removeListener('finish', finish);
      res.removeListener('close', close);
    };
    const finish = () => {
      cleanup();
      resolve();
    };
    const close = () => {
      cleanup();
      resolve();
    };

    res.once('finish', finish);
    res.once('close', close);
    try {
      app(req, res);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
};
