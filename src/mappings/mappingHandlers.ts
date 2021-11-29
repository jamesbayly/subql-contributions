import { SubstrateEvent } from "@subql/types";
import { Contribution } from "../types/models/Contribution";
import { BalanceOf } from "@polkadot/types/interfaces";

export async function handleCrowdloanContributed(
  substrateEvent: SubstrateEvent
) {
  // logger.info(JSON.stringify(substrateEvent));
  const {
    block: { timestamp, block: rawBlock },
    idx,
    event: {
      data: [contributor, fundIdx, amount],
    },
  } = substrateEvent;
  const blockNum = rawBlock.header.number.toNumber();
  const contribution = new Contribution(`${blockNum}-${idx}`);
  contribution.account = contributor.toString();
  contribution.crowdloan = parseInt(fundIdx.toString());
  contribution.amount =
    (amount as BalanceOf).toBigInt() / BigInt("10000000000");
  contribution.contributedDate = timestamp;
  contribution.blockNum = blockNum;
  await contribution.save();
}
