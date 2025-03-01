import { AccountId, Binary, SS58String } from "polkadot-api";
import { paraChain, paseoAssetHubChainApi } from "./asset-hub-chain";
import {
  paseo,
  paseo_asset_hub,
  paseo_people,
  XcmVersionedAsset,
  XcmVersionedLocation,
  XcmV3MultiassetFungibility,
  XcmV3Junction,
  XcmV3Junctions,
  XcmVersionedAssets,
  XcmV3WeightLimit,
} from "@polkadot-api/descriptors";
import { paseoRelayChainApi, relayChain } from "./relay-chain";

export const reserveTransferToParachain = (
  address: SS58String,
  amount: bigint
): any => {
  // TODO: Implement a logic to reserve transfer to parachain
  // const xcmTransaction =
};

export const teleportToParaChain = (address: SS58String, amount: bigint) => {
  // TODO: Implement a logic to teleport to parachain

  // Construct XCM transaction to teleport from relay chain (PASEO) to parachain (PASEO Asset Hub)
  const xcmTx = paseoRelayChainApi.tx.XcmPallet.transfer_assets({
    dest: XcmVersionedLocation.V4({
      parents: 0, // Because we are in the relay chain at the moment
      interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(1000)),
    }),
    beneficiary: getBeneficiary(address),
    assets: getNativeAsset(0, amount),
    fee_asset_item: 0,
    weight_limit: XcmV3WeightLimit.Unlimited(),
  });

  return xcmTx;
};

export const teleportToRelayChain = (
  address: SS58String,
  amount: bigint
): any => {
  // TODO: Implement a logic to teleport to relaychain

  // Construct XCM transaction to teleport from parachain (PASEO Asset Hub) to relay chain (PASEO)
  const xcmTx = paseoAssetHubChainApi.tx.PolkadotXcm.reserve_transfer_assets({
    dest: XcmVersionedLocation.V4({
      parents: 1, // Because we are in the parachain which is the "child" of the relay chain
      interior: XcmV3Junctions.Here(),
    }),
    beneficiary: getBeneficiary(address),
    assets: getNativeAsset(1, amount),
    fee_asset_item: 0,
  });

  return xcmTx;
};

const encodeAccount = AccountId().enc;

const getBeneficiary = (address: SS58String | Uint8Array) =>
  XcmVersionedLocation.V4({
    parents: 0,
    interior: XcmV3Junctions.X1(
      XcmV3Junction.AccountId32({
        network: undefined,
        id: Binary.fromBytes(
          address instanceof Uint8Array ? address : encodeAccount(address)
        ),
      })
    ),
  });

// Get the native asset in the form of XCM
const getNativeAsset = (parents: number, amount: bigint) =>
  XcmVersionedAssets.V4([
    {
      id: {
        parents,
        interior: XcmV3Junctions.Here(),
      },
      fun: XcmV3MultiassetFungibility.Fungible(amount),
    },
  ]);
