import { EXAM_CONFIGS } from '../lib/exam-config';
import { PredictorPage } from '../components/PredictorPage';

function WbjeePage() {
  return <PredictorPage config={EXAM_CONFIGS.wbjee} />;
}

export { WbjeePage };
