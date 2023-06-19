import { createYoga } from "graphql-yoga";

// Plugins
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { useDisableIntrospection } from '@envelop/disable-introspection';

import { schema } from '../schemas/graphql';

const yoga = createYoga({
  schema,
  context: (req) => ({ // Context factory gets called for every request

  }),
  graphiql: true,
  plugins: [useDisableIntrospection(), useCookies()],
});

export default yoga;