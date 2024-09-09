import { Command } from "commander";
import dotenv from "dotenv";

const command = new Command();

export const config = (paths) => {
    command
        .option("-e, --env <string>", "Especificar el entorno", "DEV")
        .parse(process.argv);

    const options = command.opts();

    dotenv.config({
        path: (options.env === "PROD" ? paths.env.prod : paths.env.dev),
    });
};