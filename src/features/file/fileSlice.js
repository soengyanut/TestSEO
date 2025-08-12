import { apiSlice } from "../api/apiSlice";

export const fileSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (formdata) => ({
        url: "/medias/upload-multiple",
        method: "POST",
        body: formdata
      })
    })
  })
});

export const { useUploadFileMutation } = fileSlice;
