import { DID, WACIProtocol, WACICredentialOfferSucceded } from "@extrimian/agent";
import { MemoryAgentSecureStorage, MemoryAgentStorage } from "../memory-agent-storage";
import credential from "./credential-person.json";
import issuerStyle from "./issuer-themes.json";
import outputDescriptors from "./output-descriptors.json";

export class IssuerWACIProtocol {
    static getWACIProtocol() {
        return new WACIProtocol({
            storage: new MemoryAgentStorage(),
            issuer: {
                issueCredentials: async (waciInvitationId: string, holderDID: string) => {
                    return new WACICredentialOfferSucceded({
                        credentials: [{
                            credential: credential as any,
                            outputDescriptor: outputDescriptors,
                        }],
                        issuer: issuerStyle,
                    });
                },
            }
        })
    }
}