"use client"
import {importFromSimplyPlural} from "@/lib/simplyPluralAPI/simplyPluralImporter";
import {QueryClient} from "@tanstack/react-query";

export async function startImportFromSimplyPlural(apiToken: string, userId: number, queryClient: QueryClient): Promise<void> {
    try {
        await importFromSimplyPlural(apiToken, userId)
    } catch (e) {
        console.error(e)
    }
    await queryClient.invalidateQueries()
}