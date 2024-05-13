import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    //check if user is authenticated
    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const documents = await ctx.db.query("documents").collect();

    return documents;
  },
});

//create the api route to create a new document
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    //check if user is authenticated
    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userId = identity.subject;
    //method to insert document to the db
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});
