import '../startup';
import mailjet, { Email } from 'node-mailjet';

class Mailjet {
    private static _instance: Mailjet;
    private readonly _client: Email.Client;

    static get instance() {
        if (!Mailjet._instance) {
            Mailjet._instance = new Mailjet();
        }
        return Mailjet._instance;
    }

    get client() {
        return this._client;
    }

    async sendException(error: Error, origin: NodeJS.UncaughtExceptionOrigin) {
        await this.client.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'deerflow.dev@gmail.com',
                        Name: 'Spotify Companion',
                    },
                    To: [
                        {
                            Email: 'deerflow.dev@gmail.com',
                            Name: 'Dev',
                        },
                    ],
                    Subject: origin,
                    TextPart: origin,
                    HTMLPart: `<h4>JSON :<h4><code>${JSON.stringify(
                        error,
                        null,
                        4
                    )}</code><h4>Raw :</h4><code>${error}</code>`,
                    CustomID: 'UncaughtException',
                },
            ],
        });
    }

    private constructor() {
        if (!process.env.MAILJET_KEY_PUBLIC || !process.env.MAILJET_KEY_PRIVATE)
            throw new Error('Missing mailjet credentials');
        this._client = mailjet.connect(process.env.MAILJET_KEY_PUBLIC, process.env.MAILJET_KEY_PRIVATE);
    }
}

export default Mailjet;
