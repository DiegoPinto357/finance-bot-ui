import Typography from '../lib/Typography';

const Settings = () => {
  return (
    <>
      <Typography variant="h1">Settings</Typography>
      <div className="my-8">
        <Typography variant="h2">Status</Typography>
        <p>App version: {APP_VERSION}</p>
        <p>Server version: </p>
        <p>Server status:</p>
      </div>

      <div className="my-8">
        <Typography variant="h2">Configs</Typography>
        Server host:
      </div>

      <div className="my-8">
        <Typography variant="h2">Actions</Typography>
        Update tables Clear cache
      </div>

      <div className="my-8">
        <Typography variant="h2">Debug</Typography>
        Dryrun mode Data cache config
      </div>
    </>
  );
};

export default Settings;
