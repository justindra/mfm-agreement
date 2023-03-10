import { StackContext, Api } from 'sst/constructs';
import { Config } from 'sst/constructs';

export function API({ stack }: StackContext) {
  const google = Config.Secret.create(stack, 'GOOGLE_API_KEY');

  const api = new Api(stack, 'api', {
    routes: {
      'GET /': 'packages/functions/src/lambda.handler',
      'GET /data': {
        function: {
          handler: 'packages/functions/src/data.handler',
          bind: [google.GOOGLE_API_KEY],
        },
      },
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
