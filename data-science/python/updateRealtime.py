# Update realtime data to RDS
# This script is used to update the realtime parking sensor data to RDS.

import boto3 as B
import requests as rq
import datetime as DT
from tqdm import trange

URL = "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/on-street-parking-bay-sensors/records"

def updateRealtimeData(url: str = URL) -> int:
    """
    Retrieve realtime parking sensor data from the given URL and update it to RDS.
    """
    try:
        resp = rq.get(url)
        resp.raise_for_status()  # Raise an error for bad responses
        data = resp.json()
    except rq.RequestException as e:
        raise e(f"Error fetching data from {url}")
        
    print(f"Retrieved {len(data['records'])} records from {url}")
    data = data.get("records", [])
    for _ in trange(len(data), desc="Wrangling data..."):
        # Rearrange entry
        entry = data[_]
        entry.pop("location") # Remove location field, it's in the on-street-parking-bays
        entry["lastupdated"] = DT.fromisoformat(entry["lastupdated"])
        entry["status_timestamp"] = DT.fromisoformat(entry["status_timestamp"])
        status = entry.pop("status_description")
        entry["presented"] = True if status == "Present" else False

    # TODO: Update the wrangled data to RDS
    # NOTE: use another primary key for this table, e.g., "bay_id" + "lastupdated", as some sensors seems dead

    return len(data)

if __name__ == "__main__":
    # Run the update
    print("Updating realtime parking sensor data to RDS...")
    updated_count = updateRealtimeData()
    print(f"Records updated: {updated_count}")