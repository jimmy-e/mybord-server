import { restrictUserData } from '../../userUtils/userUtils';

export default async (parent, args, { prisma }, info) => {
  const finalArgs = {
    ...args,
    where: {
      ...args.where,
    },
  };
  if (args && args.where && args.where.email) {
    delete finalArgs.where.email;
  }

  const users = await prisma.query.users(finalArgs, info);

  return users.map(async (user) => restrictUserData(user));
};
