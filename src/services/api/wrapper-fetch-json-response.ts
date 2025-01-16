import { FetchJsonResponse } from "./types/fetch-json-response";
import HTTP_CODES_ENUM from "./types/http-codes";

async function wrapperFetchJsonResponse<T>(
  response: Response
): Promise<FetchJsonResponse<T>> {
  const status = response.status as FetchJsonResponse<T>["status"];

  // Handle successful responses with data
  if (response.headers.get("content-type")?.includes("application/json")) {
    const result = await response.json();
    
    if (status === HTTP_CODES_ENUM.OK || status === HTTP_CODES_ENUM.CREATED) {
      return {
        status,
        data: result.data || result
      };
    }

    // Handle validation errors
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      return {
        status,
        data: {
          status: HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY,
          errors: result.errors || {}
        }
      };
    }
  }

  // Handle no content and error responses
  if (status === HTTP_CODES_ENUM.NO_CONTENT) {
    return {
      status,
      data: undefined
    };
  }

  // Handle server errors
  return {
    status: HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR,
    data: undefined
  };
}

export default wrapperFetchJsonResponse;