import { Connection, DATA_TYPE } from "jsstore";
import WorkerInjector from "jsstore/dist/worker_injector";

let dbVersion = 2;
let dbName = "moza_chat";

export const idbConnection = new Connection();
idbConnection.addPlugin(WorkerInjector);

const timestamps = {
  createdAt: { dataType: DATA_TYPE.String },
  updatedAt: { dataType: DATA_TYPE.String },
};

const roomTable = {
  name: "rooms",
  columns: {
    _id: {
      dataType: DATA_TYPE.String,
      unique: true,
      primaryKey: true,
      notNull: true,
    },
    description: { dataType: DATA_TYPE.String },
    picture: { dataType: DATA_TYPE.String },
    messages: { dataType: DATA_TYPE.Array },
    participants: { dataType: DATA_TYPE.Array },
    restricted: { dataType: DATA_TYPE.Boolean },
    private: { dataType: DATA_TYPE.Boolean },
    likes: { dataType: DATA_TYPE.Number },
    initiated_by: { dataType: DATA_TYPE.Object },
    ...timestamps,
  },
};

const messageTable = {
  name: "messages",
  columns: {
    _id: {
      dataType: DATA_TYPE.String,
      unique: true,
      primaryKey: true,
      notNull: true,
    },
    content: { dataType: DATA_TYPE.String },
    sendee: { dataType: DATA_TYPE.String },
    room: { dataType: DATA_TYPE.String },
    refBy: { dataType: DATA_TYPE.Array },
    ...timestamps,
  },
};

export async function openLocalDatabase({
  onOpenSuccess,
  onOpenError,
}: {
  onOpenSuccess?: () => void;
  onOpenError?: () => void;
}): Promise<boolean> {
  try {
    let ok = idbConnection.initDb({
      name: dbName,
      tables: [roomTable, messageTable],
      version: dbVersion,
    });

    if (onOpenSuccess && typeof onOpenSuccess === "function") onOpenSuccess();

    return ok;
  } catch (e) {
    if (onOpenError && typeof onOpenError === "function") {
      onOpenError();
    }
    return Promise.reject(false);
  }
}
