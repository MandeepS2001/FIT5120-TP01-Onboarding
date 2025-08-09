# Update static data to RDS
# This script is used to parse static data from CSV files and update them to RDS.
# Should be run in EC2 instance, or any environment if remote access to RDS is available.

import boto3 as B
import os
from tqdm import trange

DATASET_SIGNS_CSV = "sign-plates-located-in-each-parking-zone.csv"
DATASET_ZONE2STREET_CSV = "parking-zones-linked-to-street-segments.csv"
DATASET_BAYS_CSV = "on-street-parking-bays.csv"
DATASET_POP_FORECAST_CSV = "city-of-melbourne-population-forecasts-by-small-area-2020-2040.csv"

rds = B.client('rds')

## Sign plates located in each parking zone
def parseDays(days: str) -> int:
    """
    Parse a string of days into an integers representing the days of the week.
    e.g., 
    "Sat" -> 0b0000001 (Satday)
    "Mon-Fri" => 0b0111110 (Mon to Friday)
    "Sat-Sun" => 0b1000001 (Saturday and Sunday)

    Why not using a list of booleans/set of integers?
    RDS does not support such data types, so an integer is used instead.
    """
    days_to_int = {
        "Sun": 0b1000000,
        "Mon": 0b0100000,
        "Tue": 0b0010000,
        "Wed": 0b0001000,
        "Thu": 0b0000100,
        "Fri": 0b0000010,
        "Sat": 0b0000001,
    }
    ret = 0

    if days.find('-') != -1:
        # Contains a range of days
        start_day, end_day = days.split('-')
        start_day = days_to_int[start_day]
        end_day = days_to_int[end_day]
        if start_day <= end_day:
            # Normal range
            for day in range(start_day, end_day + 1):
                ret |= day
        else:
            # Wraps around the week (e.g., "Sat-Sun")
            for day in range(start_day, 7):
                ret |= day
            for day in range(0, end_day + 1):
                ret |= day
    else:
        # Only one single day, a simple mapping is all that is needed
        ret = days_to_int[days]
    
    return ret

def prepareSigns(file:str=DATASET_SIGNS_CSV) -> int:
    if not os.path.exists(file):
        return -1
    
    # TODO: access to RDS

    # Read csv 
    with open(file, 'r') as f:
        lines = f.readlines()
    parse = 0 # Record how many lines were parsed
    title = lines[0].strip().split(',') # Filter out the title line

    # Parse the rest of the lines one by one
    for _ in trange(len(lines[1:])):
        line = lines[_ + 1]
        values = line.strip().split(',')
        if len(values) != len(title):
            continue  # Skip malformed lines

        # Parse the date part
        data = values.strip().split(',')
        data[1] = parseDays(data[1])

        # TODO: Insert into RDS

        # Count
        parsed += 1
    return parsed

## Parking zones linked to street segments
def prepareZone2Street(file:str=DATASET_ZONE2STREET_CSV) -> int:
    if not os.path.exists(file):
        return -1
    
    
    # TODO: access to RDS

    # Read csv
    with open(file, 'r') as f:
        lines = f.readlines()
    parse = 0  # Record how many lines were parsed
    title = lines[0].strip().split(',')  # Filter out the title line

    # Parse the rest of the lines one by one
    for _ in trange(len(lines[1:])):
        line = lines[_ + 1]
        values = line.strip().split(',')
        if len(values) != len(title):
            continue  # Skip malformed lines

        # Parse the data part
        data = values.strip().split(',')
        # TODO: Insert into RDS

        # Count
        parse += 1
    return parse

## On-street parking bays
def prepareBays(file:str=DATASET_BAYS_CSV) -> int:
    if not os.path.exists(file):
        return -1
    
    
    # TODO: access to RDS

    # Read csv
    with open(file, 'r') as f:
        lines = f.readlines()
    parse = 0  # Record how many lines were parsed
    title = lines[0].strip().split(',')  # Filter out the title line

    # Parse the rest of the lines one by one
    for _ in trange(len(lines[1:])):
        line = lines[_ + 1]
        values = line.strip().split(',')
        if len(values) != len(title):
            continue  # Skip malformed lines

        # Parse the data part
        data = values.strip().split(',')
        
        # TODO: Insert into RDS
        # Note that not all columns would be stored in RDS.

## City of Melbourne Population Forecasts by Small Area 2023-2043
def preparePopForecast(file:str=DATASET_POP_FORECAST_CSV) -> int:
    if not os.path.exists(file):
        return -1
    
    
    # TODO: access to RDS
    # Read csv
    with open(file, 'r') as f:
        lines = f.readlines()
    parse = 0  # Record how many lines were parsed
    title = lines[0].strip().split(',')  # Filter out the title line
    # Parse the rest of the lines one by one
    for _ in trange(len(lines[1:])):
        line = lines[_ + 1]
        values = line.strip().split(',')
        if len(values) != len(title):
            continue  # Skip malformed lines

        # Parse the data part
        data = values.strip().split(',')

        # TODO: Insert into RDS

        # Count
        parse += 1
    return parse

if __name__ == "__main__":
    # Prepare the data
    print("Preparing static data for RDS...")

    print(f"Parsing sign plates({DATASET_SIGNS_CSV})...")
    signs_parsed = prepareSigns()
    print(f"Signs parsed: {signs_parsed}")

    print(f"Parsing parking zones linked to street segments({DATASET_ZONE2STREET_CSV})...")
    zone2street_parsed = prepareZone2Street()
    print(f"Zone to street parsed: {zone2street_parsed}")

    print(f"Parsing on-street parking bays({DATASET_BAYS_CSV})...")
    bays_parsed = prepareBays()
    print(f"Bays parsed: {bays_parsed}")

    print(f"Parsing city of Melbourne population forecasts({DATASET_POP_FORECAST_CSV})...")
    pop_forecast_parsed = preparePopForecast()
    print(f"Population forecasts parsed: {pop_forecast_parsed}")
    print("Static data preparation completed.")