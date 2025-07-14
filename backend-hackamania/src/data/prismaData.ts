import prisma from "./client";

export const getMessages = async (userid: string, range: "day" | "week" | "month"): Promise<any> => {
    // Step 1: Calculate the cutoff date
  const now = new Date();
  let cutoff = new Date(now);
  switch (range) {
    case 'day':
      cutoff.setDate(now.getDate() - 1);
      break;
    case 'week':
      cutoff.setDate(now.getDate() - 7);
      break;
    case 'month':
      cutoff.setMonth(now.getMonth() - 1);
      break;
    default:
      throw new Error('Invalid range. Use "day", "week", or "month".');
  }

  // Step 2: Find team members
  const teamMembers = await prisma.user.findMany({
    where: { teamleadid: userid },
    select: { userid: true },
  });
  const memberIds = teamMembers.map(u => u.userid);

  if (memberIds.length === 0) return [];

  // Step 3: Get messages from team members in the date range
  const messages = await prisma.message.findMany({
    where: {
      userid: { in: memberIds },
      timestamp: { gte: cutoff }
    },
    select: { message: true, happiness: true, sadness: true, tiredness: true, frustration: true },
  });

  return messages;
}

export async function createMessage(
  message: string,
  userid: string,
  happiness: number,
  sadness: number,
  frustration: number,
  tiredness: number
) {
  // Optionally, you can validate emotion scores here (0.00 to 1.00)

  // Optionally, check that the user exists:
  const userExists = await prisma.user.findUnique({ where: { userid } });
  if (!userExists) {
    throw new Error('You must first be registered! Run "/imnew @YourTeamLeader"');
  }

  return await prisma.message.create({
    data: {
      message,
      userid,
      happiness,
      sadness,
      frustration,
      tiredness,
    },
  });
}

export async function createUser(userid: string, teamleadid?: string) {
  try {
    const user = await prisma.user.create({
      data: {
        userid,
        teamleadid,
      },
    });
    return user;
  } catch (error: any) {
    // Check if it's a unique constraint violation
    console.log(error);
    if (
      error.code === 'P2002'
    ) {
      // Handle duplicate user ID case
      throw new Error('User with this userid already exists.');
    } else if (error.code === 'P2003') {
      throw new Error('Your team leader is not registered.');
    }
    // Throw other errors up the stack
    throw error;
  }
}

export async function changeTeamLead(userid: string, teamleadid: string) {
  // If changing to a new teamlead, check that teamleadid exists (unless clearing it)
  const teamlead = await prisma.user.findUnique({ where: { userid: teamleadid } });
  if (!teamlead) {
    throw new Error('Specified team lead does not exist');
  }

  try {
    const updated = await prisma.user.update({
      where: { userid },
      data: { teamleadid },
    });
    return updated;
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('You are not registered in our system! Please use /imnew to get started.');
    }
    throw error;
  }
}