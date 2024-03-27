import { createHash, randomBytes } from 'node:crypto';

function md5(content) {  
    return createHash('md5').update(content).digest('hex');
}

function randomString(length) {
    if (length % 2 !== 0) {
      length++;
    }
  
    return randomBytes(length / 2).toString("hex");
}

export {
    md5,
    randomString
}