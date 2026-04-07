import {useState} from "react";
import {fetchPrivacyBucket} from "@/lib/clientApi/clientPrivacyBucketsAPI";

export default function PrivacyBucketCard({bucketId}: {bucketId: number}) {
    const [isSelected, setIsSelected] = useState<boolean>(false)
    const {data: bucket} = fetchPrivacyBucket(bucketId)

    return (
        <button
            className={isSelected ? "border-accent border-2 flex flex-col gap-4 rounded-lg cursor-pointer hover:bg-bg-hover bg-bg-sunken" : "border-bg-sunken border-2 flex flex-col gap-4 rounded-lg cursor-pointer hover:bg-bg-hover bg-bg-sunken"}
            onClick={() => {
                setIsSelected(!isSelected)
            }}
        >
            {bucket?.name}
        </button>
    )
}