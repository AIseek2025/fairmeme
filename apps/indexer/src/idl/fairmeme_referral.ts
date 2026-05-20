export type FairMemeReferral = {
  "version": "0.1.0",
  "name": "fairmeme_referral",
  "instructions": [
    {
      "name": "store",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "referral",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "invitedCode",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "referral",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "invitedCode",
            "type": "string"
          }
        ]
      }
    }
  ]
};

export const IDL: FairMemeReferral = {
  "version": "0.1.0",
  "name": "fairmeme_referral",
  "instructions": [
    {
      "name": "store",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "referral",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "invitedCode",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "referral",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "invitedCode",
            "type": "string"
          }
        ]
      }
    }
  ]
};
