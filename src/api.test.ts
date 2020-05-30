import api from './api';

import express from 'express';

test('should be an Express app', () => {
  expect(api).toBeInstanceOf(express);
})
