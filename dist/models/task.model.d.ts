import mongoose from "mongoose";
declare const Task: mongoose.Model<{
    title: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: NativeDate;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    taskListId?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    title: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: NativeDate;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    taskListId?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    title: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: NativeDate;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    taskListId?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: NativeDate;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    taskListId?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    title: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: NativeDate;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    taskListId?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    title: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: NativeDate;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    taskListId?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        title: string;
        status: "pending" | "in-progress" | "completed";
        dueDate: NativeDate;
        description?: string | null;
        userId?: mongoose.Types.ObjectId | null;
        taskListId?: mongoose.Types.ObjectId | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        title: string;
        status: "pending" | "in-progress" | "completed";
        dueDate: NativeDate;
        description?: string | null;
        userId?: mongoose.Types.ObjectId | null;
        taskListId?: mongoose.Types.ObjectId | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    title: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: NativeDate;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    taskListId?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    title: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: NativeDate;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    taskListId?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Task;
//# sourceMappingURL=task.model.d.ts.map