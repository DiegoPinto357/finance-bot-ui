import Typography from '../lib/Typography';
import Status from './Status';
import Configs from './Configs';

const Settings = () => {
  return (
    <>
      <Typography variant="h1">Settings</Typography>

      <Status className="my-8" />
      <Configs className="my-8" />

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
