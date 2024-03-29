export interface Project {
    userid:   number;
    username: string;
    password: number;
    image:    string;
    type:     string;
    email:    string;
}

export interface insertVote {
    winnerID: number;
    loserID: number;
}