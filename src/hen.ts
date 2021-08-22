import fetch from "cross-fetch";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client/core";

const TOKEN_DETAIL = gql`
  fragment TokenDetail on hic_et_nunc_token {
    id
    title
    description
    timestamp
    display_uri
    artifact_uri
		mime
    metadata
    creator {
      name
      address
    }
  }
`;

const SWAP_DETAIL = gql`
  fragment SwapDetail on hic_et_nunc_swap {
    id
    timestamp
    price
    amount
    amount_left
  }
`;

const NEWLY_MINTED = gql`
  ${TOKEN_DETAIL}
  query NewlyMinted($limit: Int!) {
    hic_et_nunc_token(limit: $limit, order_by: { timestamp: desc }) {
      ...TokenDetail
    }
  }
`;

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://api.hicdex.com/v1/graphql", fetch }),
  cache: new InMemoryCache(),
});

export async function pollNewlyMinted(limit: number) {
  const { data } = await client.query({
    query: NEWLY_MINTED,
    variables: { limit },
  });
  return data.hic_et_nunc_token;
}
