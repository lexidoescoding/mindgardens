"use client"
import {useUserProfile} from "@/context/UserProfileContext"
import {useFolderMap} from "@/context/FolderMapContext"
import {getWelcomeMessage} from "@/lib/UIStuff/welcomeMessages"
import {Sparkles} from "lucide-react"

export default function HomePage() {

    const userData = useUserProfile()
    const { folderMap, memberByName } = useFolderMap()

    const rootFolders = Array.from(folderMap?.get(null)?.values() ?? [])
    const allFolders = Array.from(folderMap?.values() ?? []).flatMap((group) =>
        Array.from(group.values()),
    )
    const members = Array.from(memberByName?.values() ?? [])
    const frontingMembers = members.filter((member) => member.is_fronting)
    const welcomeMessage = getWelcomeMessage(userData)

  return (
      <main className="flex h-[calc(100dvh-4rem)] flex-col gap-6 overflow-y-auto p-4 pb-8">
          <section className="rounded-3xl border border-bg-hover bg-bg-surface p-6 shadow-sm gap-2">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-bg-sunken px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                          <Sparkles className="h-3.5 w-3.5 text-accent" />
                          Home dashboard
                      </div>

                      <div className="space-y-2">
                          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                              {welcomeMessage[0] + ", " + userData.display_name + welcomeMessage[1]}
                          </h1>

                      </div>
                  </div>
                </div>
            </section>
      </main>
  )
}

function MetricCard(){
    
}