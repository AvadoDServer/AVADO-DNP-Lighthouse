#!/bin/bash

SETTINGSFILE=$1
#Subcommand: either "bn" (beacon_node) or "vc" (validator_client)
SUBCOMMAND=$2

echo "Staring Lighthouse ${SUBCOMMAND}"

if [ ! -f "${SETTINGSFILE}" ]; then
    echo "Starting with default settings"
    cp /opt/lighthouse/defaultsettings.json ${SETTINGSFILE}
fi

NETWORK=$(cat ${SETTINGSFILE} | jq '."network"' | tr -d '"')
mkdir -p "/data/data-${NETWORK}/"

# Get JWT Token
JWT_SECRET="/data/data-${NETWORK}/jwttoken"
until $(curl --silent --fail "http://dappmanager.my.ava.do/jwttoken.txt" --output "${JWT_SECRET}"); do
  echo "Waiting for the JWT Token"
  sleep 5
done

case ${NETWORK} in
  "gnosis")
    P2P_PORT=9006
    ;;
  "prater")
    P2P_PORT=9003
    ;;
  *)
    P2P_PORT=9000
    ;;
esac

# Create config file
GRAFFITI=$(cat ${SETTINGSFILE} | jq -r '."validators_graffiti"')
EE_ENDPOINT=$(cat ${SETTINGSFILE} | jq -r '."ee_endpoint"')
P2P_PEER_LOWER_BOUND=$(cat ${SETTINGSFILE} | jq -r '."p2p_peer_lower_bound"')
P2P_PEER_UPPER_BOUND=$(cat ${SETTINGSFILE} | jq -r '."p2p_peer_upper_bound"')
INITIAL_STATE=$(cat ${SETTINGSFILE} | jq -r '."initial_state" // empty')
DATA_PATH="/data/data-${NETWORK}"
P2P_PORT=${P2P_PORT}
NETWORK="${NETWORK}"
VALIDATORS_PROPOSER_DEFAULT_FEE_RECIPIENT=$(cat ${SETTINGSFILE} | jq -r '."validators_proposer_default_fee_recipient" // empty')
MEV_BOOST_ENABLED=$(cat ${SETTINGSFILE} | jq -r '."mev_boost" // empty')

case ${SUBCOMMAND} in
  "beacon_node" | "bn" | "b" | "beacon")
    exec /usr/local/bin/lighthouse \
    --datadir=${DATA_PATH} \
    ${SUBCOMMAND} \
    --network="${NETWORK}" \
    --staking \
    --execution-endpoint=${EE_ENDPOINT} \
    --execution-jwt=${JWT_SECRET} \
    --http-address=0.0.0.0 \
    --http-port=5051 \
    --http-allow-origin="*" \
    --port=${P2P_PORT} \
    ${INITIAL_STATE:+--checkpoint-sync-url="${INITIAL_STATE}"} \
    ${VALIDATORS_PROPOSER_DEFAULT_FEE_RECIPIENT:+--suggested-fee-recipient=${VALIDATORS_PROPOSER_DEFAULT_FEE_RECIPIENT}} \
    ${MEV_BOOST_ENABLED:+--builder="http://mevboost.my.ava.do:18550"} \
    ${DISCOVERY_BOOTNODES:+--p2p-discovery-bootnodes=${DISCOVERY_BOOTNODES}} \
    --graffiti="${GRAFFITI}" \
    ${EXTRA_OPTS_BEACON_NODE}
    ;;
  "validator_client" | "v" | "vc" | "validator")
    exec /usr/local/bin/lighthouse \
    --datadir=${DATA_PATH} \
    ${SUBCOMMAND} \
    --network="${NETWORK}" \
    ${VALIDATORS_PROPOSER_DEFAULT_FEE_RECIPIENT:+--suggested-fee-recipient=${VALIDATORS_PROPOSER_DEFAULT_FEE_RECIPIENT}} \
    --graffiti="${GRAFFITI}" \
    ${EXTRA_OPTS_VALIDATOR_CLIENT}
    ;;
  *)
    echo "Error in config files"
    ;;
esac
