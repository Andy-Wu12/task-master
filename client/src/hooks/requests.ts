
async function queryGraphQL(queryBody: string): Promise<any> {
  const response = await fetch(`${process.env.REACT_APP_API_ROUTE}/graphql`, {
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/graphql'
    },
    body: queryBody
  });

  return response;
}

export {
  queryGraphQL
}