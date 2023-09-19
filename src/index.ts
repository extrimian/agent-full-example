import { Agent, AgentModenaUniversalRegistry, AgentModenaUniversalResolver, CredentialFlow, IdentityPlainTextDataShareBehavior, VerifiableCredentialWithInfo, WACIMessage, WACIProtocol } from "@extrimian/agent";
import { getHolderAgent } from "./holder/holder";
import { getIssuerAgent } from "./issuer/issuer";
import { MemoryAgentSecureStorage, MemoryAgentStorage } from "./memory-agent-storage";
import { getVeriierAgent } from "./verifier/verifier";
import credential from "./issuer/credential-person.json";

const index = async () => {
    const issuerAgent = await getIssuerAgent();

    const vc = await issuerAgent.vc.signVC({ credential: credential as any })

    const holderAgent = await getHolderAgent();
    const verifierAgent = await getVeriierAgent();

    console.log(issuerAgent.identity.getOperationalDID());

    issuerAgent.vc.credentialIssued.on((args) => {
        console.log(args);
    });

    //Creo una promesa para esperar la llegada de la credencial.
    const waitCredentialArrived = new Promise<void>((resolve) => {
        holderAgent.vc.credentialArrived.on((args) => {
            resolve();
        });
    })

    setTimeout(async () => {
        const invitationMessage = await issuerAgent.vc.createInvitationMessage({ flow: CredentialFlow.Issuance });
        await holderAgent.vc.processMessage({ message: invitationMessage });
    }, 20000);

    //Espero hasta que se ejecute la promesa.
    await waitCredentialArrived;
}

index();