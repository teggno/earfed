import { Provider } from "../providers";
import type {
  AppleCollectionId,
  AppleCollection,
  AppleShowId,
} from "../userData/showTypes";
import ShowBase, {
  ShowStatusContainer,
  defaultShowStatus,
  defaultUpdated,
} from "./ShowBase";
import type { AppleShowInput } from "../userData/shows";

export default class AppleShow extends ShowBase {
  constructor(
    collection: { value: AppleCollection; updated?: Date },
    status: ShowStatusContainer = defaultShowStatus()
  ) {
    super(status);
    this.collection = {
      ...collection,
      updated: collection.updated ?? defaultUpdated(),
    };
  }

  private readonly collection: { value: AppleCollection; updated: Date };

  get uniqueShowId() {
    return appleUniqueShowId(this.collection.value.collectionId);
  }

  get subscribedShowUrl() {
    return (
      "/subscriptions/shows/apple/" +
      this.collection.value.collectionId.toString()
    );
  }

  get showTitle() {
    return this.collection.value.collectionName;
  }

  get showImageUrl() {
    return this.collection.value.artworkUrl60;
  }

  get showImageUrlMedium() {
    return this.collection.value.artworkUrl600;
  }

  get categories() {
    return this.collection.value.genres ?? ([] as string[]);
  }

  get artistName() {
    return this.collection.value.artistName;
  }

  sameShow(collectionId: number) {
    return collectionId === this.collection.value.collectionId;
  }

  makeShowInput(): AppleShowInput {
    return {
      provider: Provider.Apple,
      collection: this.collection.value,
    };
  }

  makeShowId(): AppleShowId {
    return {
      provider: Provider.Apple,
      collectionId: this.collection.value.collectionId,
    };
  }
}

export function appleUniqueShowId(collectionId: AppleCollectionId) {
  return `${Provider.Apple}_${collectionId}`;
}
