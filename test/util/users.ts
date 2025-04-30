export interface User {
  firstName: string;
  lastName: string;
  zipCode: string;
  username: string;
  password: string;
}

export default {
  standard: {
    firstName: 'Standard',
    lastName: 'User',
    zipCode: '97232',
    username: 'standard_user',
    password: 'secret_sauce'
  },
  locked_out: {
    firstName: 'Locked',
    lastName: 'User',
    zipCode: '12345',
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  problem: {
    firstName: 'Problem',
    lastName: 'User',
    zipCode: 'invalid',
    username: 'problem_user',
    password: 'secret_sauce'
  },
  glitch: {
    firstName: 'Glitch',
    lastName: 'User',
    zipCode: '12345',
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  }
};
