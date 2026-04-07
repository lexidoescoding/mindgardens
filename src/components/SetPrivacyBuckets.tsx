import {fetchAllPrivacyBuckets} from "@/lib/clientApi/clientPrivacyBucketsAPI";
import React, {Dispatch, SetStateAction} from "react";
import PrivacyBucketCard from "@/components/PrivacyBucketCard";

export default function SetPrivacyBuckets({ setPrivacyBuckets, privacyBuckets, onClose }: { setPrivacyBuckets: Dispatch<SetStateAction<number[]>>,privacyBuckets: number[], onClose: () => void }) {
    const { data: buckets } = fetchAllPrivacyBuckets()
    return (
        <main
            className="flex items-center justify-center z-50 fixed inset-0"
            onClick={() => {
                setPrivacyBuckets([])
                onClose()
            }}
        >
            <div
                className="rounded-xl p-6 w-80 flex flex-col gap-4 max-h-[80dvh]"
                style={{ backgroundColor: 'var(--color-bg-base)' }}
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-text-primary">Privacy Buckets</h2>
                <div
                    tabIndex={-1}
                    className="overflow-y-auto flex-1 h-[calc(80dvh-5rem)] flex flex-col gap-4 rounded-lg p-2 border-2 border-bg-sunken"
                >
                    {buckets?.map((bucket) => (
                        <div
                            key={bucket.bucket_id}
                            className="flex flex-col gap-4"
                            onClick={() =>  setPrivacyBuckets([...privacyBuckets, bucket.bucket_id])}
                        >
                            <PrivacyBucketCard bucketId={bucket.bucket_id}/>
                        </div>
                    ))}
                </div>
                <button onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                }}
                        className="rounded-lg p-2 font-medium bg-accent text-accent-on hover:bg-accent-hover"
                >
                    Save
                </button>
            </div>
        </main>
    )
}