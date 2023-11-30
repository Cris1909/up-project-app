var ObjectId = require('mongodb').ObjectId;

export const parseToObjectId = (_id: string) => {
  return new ObjectId(_id);
};
