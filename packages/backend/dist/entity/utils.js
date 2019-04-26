"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampsEntity = {
    insertedAt: {
        name: "inserted_at",
        type: "timestamp without time zone",
        createDate: true
    },
    updatedAt: {
        name: "updated_at",
        type: "timestamp without time zone",
        updateDate: true
    }
};
exports.IdEntity = {
    id: {
        type: Number,
        primary: true,
        generated: true
    }
};
