/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type CompetitionInfoStruct = {
  nextTokenId: BigNumberish;
  provenance: string;
  valid: boolean;
};

export type CompetitionInfoStructOutput = [BigNumber, string, boolean] & {
  nextTokenId: BigNumber;
  provenance: string;
  valid: boolean;
};

export interface CompetitionMinterInterface extends utils.Interface {
  functions: {
    "canClaim(uint16,address,bytes32[])": FunctionFragment;
    "claim(uint16,uint16,bytes32[])": FunctionFragment;
    "getAdditionalAttributes(uint256,bytes12)": FunctionFragment;
    "getCompetition(uint16)": FunctionFragment;
    "getImageBaseURL()": FunctionFragment;
    "getTokenOrderIndex(uint256,bytes12)": FunctionFragment;
    "getTokenProvenance(uint256,bytes12)": FunctionFragment;
    "imageBaseURL()": FunctionFragment;
    "owner()": FunctionFragment;
    "packData(uint16,uint16)": FunctionFragment;
    "placeholderImageURL()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setCompetition(uint16,string,uint256,uint256,bytes32)": FunctionFragment;
    "setImageBaseURL(string)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unpackData(bytes12)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "canClaim",
    values: [BigNumberish, string, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "claim",
    values: [BigNumberish, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getAdditionalAttributes",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getCompetition",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getImageBaseURL",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenOrderIndex",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenProvenance",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "imageBaseURL",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "packData",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "placeholderImageURL",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setCompetition",
    values: [BigNumberish, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setImageBaseURL",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "unpackData",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "canClaim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAdditionalAttributes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCompetition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getImageBaseURL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenOrderIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenProvenance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "imageBaseURL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "packData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "placeholderImageURL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCompetition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setImageBaseURL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpackData", data: BytesLike): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface CompetitionMinter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CompetitionMinterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    canClaim(
      competitionId: BigNumberish,
      claimer: string,
      proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    claim(
      competitionId: BigNumberish,
      orderIndex: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAdditionalAttributes(
      arg0: BigNumberish,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getCompetition(
      competitionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[CompetitionInfoStructOutput]>;

    getImageBaseURL(overrides?: CallOverrides): Promise<[string]>;

    getTokenOrderIndex(
      arg0: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTokenProvenance(
      arg0: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    imageBaseURL(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    packData(
      competitionId: BigNumberish,
      orderIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    placeholderImageURL(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setCompetition(
      competitionId: BigNumberish,
      provenance: string,
      startTokenId: BigNumberish,
      endTokenId: BigNumberish,
      allowlistRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setImageBaseURL(
      newImageBaseURL: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unpackData(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [number, number] & { competitionId: number; orderIndex: number }
    >;
  };

  canClaim(
    competitionId: BigNumberish,
    claimer: string,
    proof: BytesLike[],
    overrides?: CallOverrides
  ): Promise<boolean>;

  claim(
    competitionId: BigNumberish,
    orderIndex: BigNumberish,
    proof: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAdditionalAttributes(
    arg0: BigNumberish,
    arg1: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getCompetition(
    competitionId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<CompetitionInfoStructOutput>;

  getImageBaseURL(overrides?: CallOverrides): Promise<string>;

  getTokenOrderIndex(
    arg0: BigNumberish,
    data: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTokenProvenance(
    arg0: BigNumberish,
    data: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  imageBaseURL(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  packData(
    competitionId: BigNumberish,
    orderIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  placeholderImageURL(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setCompetition(
    competitionId: BigNumberish,
    provenance: string,
    startTokenId: BigNumberish,
    endTokenId: BigNumberish,
    allowlistRoot: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setImageBaseURL(
    newImageBaseURL: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unpackData(
    data: BytesLike,
    overrides?: CallOverrides
  ): Promise<[number, number] & { competitionId: number; orderIndex: number }>;

  callStatic: {
    canClaim(
      competitionId: BigNumberish,
      claimer: string,
      proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    claim(
      competitionId: BigNumberish,
      orderIndex: BigNumberish,
      proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    getAdditionalAttributes(
      arg0: BigNumberish,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getCompetition(
      competitionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<CompetitionInfoStructOutput>;

    getImageBaseURL(overrides?: CallOverrides): Promise<string>;

    getTokenOrderIndex(
      arg0: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokenProvenance(
      arg0: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    imageBaseURL(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    packData(
      competitionId: BigNumberish,
      orderIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    placeholderImageURL(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setCompetition(
      competitionId: BigNumberish,
      provenance: string,
      startTokenId: BigNumberish,
      endTokenId: BigNumberish,
      allowlistRoot: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setImageBaseURL(
      newImageBaseURL: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unpackData(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [number, number] & { competitionId: number; orderIndex: number }
    >;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    canClaim(
      competitionId: BigNumberish,
      claimer: string,
      proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claim(
      competitionId: BigNumberish,
      orderIndex: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAdditionalAttributes(
      arg0: BigNumberish,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getCompetition(
      competitionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getImageBaseURL(overrides?: CallOverrides): Promise<BigNumber>;

    getTokenOrderIndex(
      arg0: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokenProvenance(
      arg0: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    imageBaseURL(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    packData(
      competitionId: BigNumberish,
      orderIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    placeholderImageURL(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setCompetition(
      competitionId: BigNumberish,
      provenance: string,
      startTokenId: BigNumberish,
      endTokenId: BigNumberish,
      allowlistRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setImageBaseURL(
      newImageBaseURL: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unpackData(data: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    canClaim(
      competitionId: BigNumberish,
      claimer: string,
      proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claim(
      competitionId: BigNumberish,
      orderIndex: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAdditionalAttributes(
      arg0: BigNumberish,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCompetition(
      competitionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getImageBaseURL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokenOrderIndex(
      arg0: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokenProvenance(
      arg0: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    imageBaseURL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    packData(
      competitionId: BigNumberish,
      orderIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    placeholderImageURL(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setCompetition(
      competitionId: BigNumberish,
      provenance: string,
      startTokenId: BigNumberish,
      endTokenId: BigNumberish,
      allowlistRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setImageBaseURL(
      newImageBaseURL: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unpackData(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}