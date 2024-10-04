import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function handlerFunc(_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.stringify({ message: "serverless is up" });
  return { statusCode: 200, body };
}
