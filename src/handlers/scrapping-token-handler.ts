import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getBearerToken } from "../utils/scrapping-token";

export async function handlerFunc(_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const token = await getBearerToken();

  const body = JSON.stringify({ token });
  return { statusCode: 200, body };
}
