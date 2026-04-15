"use client"
import {useUserProfile} from "@/context/UserProfileContext";
import {useState} from "react";
import {importFromSimplyPlural} from "@/lib/simplyPluralAPI/simplyPluralImporter";
import Link from "next/link";
import {useQueryClient} from "@tanstack/react-query";
import {startImportFromSimplyPlural} from "@/lib/simplyPluralAPI/simplyPluralImporterClient";

export default function SimplyPluralImportPage(){
    const userProfile = useUserProfile()
    const queryClient = useQueryClient()
    if(!userProfile) return null
    const [apiToken, setApiToken] = useState("")
    const [step2, setStep2] = useState(false)
    const [step3, setStep3] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [apiTokenIsValid, setApiTokenIsValid] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const [loadForImport, setLoadForImport] = useState(false)

    async function handleApiTokenInput(apiToken: string) {
        setLoading(true)
        const data = await fetch("https://api.apparyllis.com/v1/me", {
            headers: {
                Authorization: apiToken
            }
        })
        switch(data.status) {
            case 200: {
                setResult("API token is valid")
                setApiTokenIsValid(true)
                setStep2(true)
                break;
            }
            case 401:{
                setResult("API token is invalid")
                setApiTokenIsValid(false)
                break
            }
        }
        setLoading(false)
    }

    return (
        <main>
            <div className="flex flex-col bg-bg-surface p-3 m-3 rounded-lg items-center justify-center gap-2">
                <h2 className="font-semibold text-2xl">
                    Step 1: Input a Simply Plural API token with "Read" checked
                </h2>
                <input
                    className="p-3 m-3 rounded-lg h-7 bg-bg-sunken w-70"
                    type="password"
                    placeholder="input Token here"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    onKeyDown={ (e) => {
                        if (e.key === "Enter") {
                            handleApiTokenInput(apiToken)
                        }
                    }}
                />
                <button onClick={ () => {
                    handleApiTokenInput(apiToken)
                }}
                        className="rounded-lg p-2 font-medium bg-accent text-accent-on hover:bg-accent-hover w-70"
                >
                    {loading ? "Checking..." : "Check API Token"}
                </button>
                {result && (
                    <div className="bg-bg-sunken px-3 py-2 rounded-lg text-sm w-70">
                        {result}
                    </div>
                )}
            </div>
            {step2 && (
                <div className="flex flex-col bg-bg-surface p-3 m-3 rounded-lg items-center justify-center gap-2">
                    <h2 className="font-semibold text-2xl">
                        Step 2: Press import
                    </h2>
                    <button onClick={async () => {
                        if(apiTokenIsValid) {
                            setLoadForImport(true)
                            await startImportFromSimplyPlural(apiToken, userProfile.user_id, queryClient)
                            setLoadForImport(false)
                            setStep3(true)
                        }
                    }}
                            className="rounded-lg p-2 font-medium bg-accent text-accent-on hover:bg-accent-hover w-70"
                    >
                        {loadForImport ? "loading..." : "import"}

                    </button>
                    {}
                </div>
            )}
            {step3 && (
                <div className="flex flex-col bg-bg-surface p-3 m-3 rounded-lg items-center justify-center gap-2">
                    <h2 className="font-semibold text-2xl">
                        Step 1: Done! Your data should now be imported.
                    </h2>
                    <Link href={"/"}
                          className="rounded-lg p-2 font-medium bg-accent text-accent-on hover:bg-accent-hover w-70 text-center"
                    >
                        home
                    </Link>
                </div>
            )}
        </main>
    )
}